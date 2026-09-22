<?php
/**
 * Leads from the website's forms.
 *
 *   POST /wp-json/venu/v1/leads
 *   { "form": "offers" | "dealership", "fields": { "name": "…", "phone": "…", … } }
 *
 * Each submission is saved under Venu Shop › Leads and emailed to the address in
 * Venu Shop › Settings. WordPress's REST API already answers cross-origin
 * requests, so the website on another domain can post here directly.
 *
 * Abuse guards: a hidden honeypot field bots fill in, a per-visitor limit of
 * five submissions per ten minutes, and length caps on every field.
 */

defined( 'ABSPATH' ) || exit;

class Venu_Shop_Leads {

	const POST_TYPE = 'venu_lead';

	/** Forms the website may post, with the label used in admin and emails. */
	const FORMS = array(
		'offers'     => 'Offers enquiry',
		'test-ride'  => 'Test ride',
		'dealership' => 'Dealership application',
	);

	const MAX_FIELDS      = 30;
	const MAX_LENGTH      = 2000;
	const RATE_LIMIT      = 5;
	const RATE_WINDOW_MIN = 10;

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_route' ) );
		add_filter( 'user_has_cap', array( __CLASS__, 'grant_caps' ), 10, 1 );

		add_action( 'add_meta_boxes_' . self::POST_TYPE, array( __CLASS__, 'meta_box' ) );
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( __CLASS__, 'columns' ) );
		add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( __CLASS__, 'column' ), 10, 2 );
		add_action( 'restrict_manage_posts', array( __CLASS__, 'filters' ) );
		add_action( 'pre_get_posts', array( __CLASS__, 'apply_filter' ) );
		add_action( 'admin_post_venu_leads_csv', array( __CLASS__, 'export_csv' ) );
	}

	public static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'          => array(
					'name'          => 'Leads',
					'singular_name' => 'Lead',
					'all_items'     => 'Leads',
					'edit_item'     => 'Lead',
					'search_items'  => 'Search leads',
					'not_found'     => 'No leads yet — they appear here as soon as someone sends a form on the website.',
				),
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => Venu_Shop_Settings::SLUG,
				'show_in_rest'    => false,
				'supports'        => array( 'title' ),
				'capability_type' => array( 'venu_lead', 'venu_leads' ),
				'map_meta_cap'    => true,
				'capabilities'    => array( 'create_posts' => 'do_not_allow' ), // leads only come from the website
			)
		);
	}

	/** Leads hold phone numbers — only store managers and admins may see them. */
	public static function grant_caps( $allcaps ) {
		if ( ! empty( $allcaps['manage_woocommerce'] ) || ! empty( $allcaps['manage_options'] ) ) {
			foreach ( array( 'edit', 'edit_others', 'edit_published', 'edit_private', 'publish', 'read_private', 'delete', 'delete_others', 'delete_published', 'delete_private' ) as $cap ) {
				$allcaps[ $cap . '_venu_leads' ] = true;
			}
		}
		return $allcaps;
	}

	public static function register_route() {
		register_rest_route(
			'venu/v1',
			'/leads',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'receive' ),
				'permission_callback' => '__return_true', // public form endpoint
				'args'                => array(
					'form'   => array(
						'type'     => 'string',
						'required' => true,
						'enum'     => array_keys( self::FORMS ),
					),
					'fields' => array(
						'type'     => 'object',
						'required' => true,
					),
				),
			)
		);
	}

	public static function receive( WP_REST_Request $request ) {
		// Honeypot: a field real visitors never see. Pretend success so bots move on.
		if ( '' !== trim( (string) $request->get_param( 'company_website' ) ) ) {
			return new WP_REST_Response( array( 'ok' => true ), 201 );
		}

		$form   = (string) $request->get_param( 'form' );
		$fields = self::clean_fields( (array) $request->get_param( 'fields' ) );

		$name  = isset( $fields['name'] ) ? $fields['name'] : '';
		$phone = isset( $fields['phone'] ) ? preg_replace( '/\D+/', '', $fields['phone'] ) : '';
		if ( 12 === strlen( $phone ) && 0 === strpos( $phone, '91' ) ) {
			$phone = substr( $phone, 2 );
		}

		if ( '' === $name ) {
			return self::error( 'missing_name', 'Please enter your name.' );
		}
		if ( ! preg_match( '/^[6-9]\d{9}$/', $phone ) ) {
			return self::error( 'bad_phone', 'Please enter a valid 10-digit mobile number.' );
		}
		if ( ! empty( $fields['email'] ) && ! is_email( $fields['email'] ) ) {
			return self::error( 'bad_email', 'Please enter a valid email address.' );
		}
		$fields['phone'] = $phone;

		// A double-tap or a resend within ten minutes is the same lead, not a new one.
		$dupe_key = 'venu_lead_seen_' . md5( $form . '|' . $phone );
		$existing = (int) get_transient( $dupe_key );
		if ( $existing && get_post( $existing ) ) {
			return new WP_REST_Response(
				array(
					'ok' => true,
					'id' => $existing,
				),
				200
			);
		}

		if ( self::rate_limited() ) {
			return self::error( 'too_many', 'You have sent a few forms already — please try again in a few minutes, or call us.', 429 );
		}

		$source = $request->get_header( 'referer' );

		$lead_id = wp_insert_post(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'publish',
				'post_title'  => $name,
			),
			true
		);
		if ( is_wp_error( $lead_id ) ) {
			return self::error( 'not_saved', 'Sorry, we could not save that. Please try again or call us.', 500 );
		}

		update_post_meta( $lead_id, '_venu_form', $form );
		update_post_meta( $lead_id, '_venu_fields', $fields );
		update_post_meta( $lead_id, '_venu_phone', $phone );
		update_post_meta( $lead_id, '_venu_model', isset( $fields['model'] ) ? $fields['model'] : '' );
		update_post_meta( $lead_id, '_venu_source', $source ? esc_url_raw( $source ) : '' );

		set_transient( $dupe_key, $lead_id, self::RATE_WINDOW_MIN * MINUTE_IN_SECONDS );
		self::notify( $lead_id, $form, $fields, $source );

		return new WP_REST_Response(
			array(
				'ok' => true,
				'id' => $lead_id,
			),
			201
		);
	}

	/** Flat string map, keys like "pin_code", values trimmed and capped. */
	private static function clean_fields( array $raw ) {
		$out = array();
		foreach ( $raw as $key => $value ) {
			if ( count( $out ) >= self::MAX_FIELDS ) {
				break;
			}
			$key = sanitize_key( (string) $key );
			if ( '' === $key ) {
				continue;
			}
			if ( is_array( $value ) ) {
				$value = implode( ', ', array_map( 'strval', array_filter( $value, 'is_scalar' ) ) );
			} elseif ( is_bool( $value ) ) {
				$value = $value ? 'Yes' : 'No';
			} elseif ( ! is_scalar( $value ) ) {
				continue;
			}
			$value = trim( sanitize_textarea_field( (string) $value ) );
			if ( '' !== $value ) {
				$out[ $key ] = function_exists( 'mb_substr' ) ? mb_substr( $value, 0, self::MAX_LENGTH ) : substr( $value, 0, self::MAX_LENGTH );
			}
		}
		return $out;
	}

	/**
	 * The visitor's IP. Behind Hostinger's CDN or Cloudflare every request can
	 * arrive from the proxy's address, which would make the limit shared by all
	 * visitors — so prefer the forwarded client address when one is present.
	 * (A spoofed header only lets a bot dodge the limit; it can't block anyone.)
	 */
	private static function client_ip() {
		foreach ( array( 'HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR' ) as $header ) {
			if ( ! empty( $_SERVER[ $header ] ) ) {
				$ip = trim( explode( ',', sanitize_text_field( wp_unslash( $_SERVER[ $header ] ) ) )[0] );
				if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
					return $ip;
				}
			}
		}
		return 'unknown';
	}

	private static function rate_limited() {
		$key  = 'venu_lead_' . md5( self::client_ip() );
		$hits = (int) get_transient( $key );
		if ( $hits >= self::RATE_LIMIT ) {
			return true;
		}
		set_transient( $key, $hits + 1, self::RATE_WINDOW_MIN * MINUTE_IN_SECONDS );
		return false;
	}

	private static function error( $code, $message, $status = 422 ) {
		return new WP_Error( 'venu_' . $code, $message, array( 'status' => $status ) );
	}

	/** "pin_code" → "Pin code" */
	public static function label( $key ) {
		return ucfirst( str_replace( array( '_', '-' ), ' ', $key ) );
	}

	private static function notify( $lead_id, $form, array $fields, $source ) {
		$to = Venu_Shop_Settings::get( 'lead_email' );
		if ( ! $to ) {
			return;
		}
		$form_label = self::FORMS[ $form ];
		$subject    = sprintf( '[Venu Motors] %s — %s', $form_label, $fields['name'] );
		if ( ! empty( $fields['model'] ) ) {
			$subject .= ' (' . $fields['model'] . ')';
		}

		$lines = array( $form_label . ' from the website', '' );
		foreach ( $fields as $key => $value ) {
			$lines[] = self::label( $key ) . ': ' . $value;
		}
		$lines[] = '';
		$lines[] = 'Call: tel:+91' . $fields['phone'];
		if ( $source ) {
			$lines[] = 'Sent from: ' . $source;
		}
		$lines[] = 'Open in WordPress: ' . admin_url( 'post.php?post=' . $lead_id . '&action=edit' );

		$headers = array();
		if ( ! empty( $fields['email'] ) ) {
			$headers[] = 'Reply-To: ' . $fields['name'] . ' <' . $fields['email'] . '>';
		}
		wp_mail( $to, $subject, implode( "\n", $lines ), $headers );
	}

	/* ─── Admin screens ─────────────────────────────────────────────────── */

	public static function meta_box() {
		add_meta_box( 'venu-lead-details', 'Details', array( __CLASS__, 'render_details' ), self::POST_TYPE, 'normal', 'high' );
	}

	public static function render_details( $post ) {
		$fields = (array) get_post_meta( $post->ID, '_venu_fields', true );
		$form   = get_post_meta( $post->ID, '_venu_form', true );
		$source = get_post_meta( $post->ID, '_venu_source', true );
		echo '<table class="widefat striped" style="margin-top:8px"><tbody>';
		printf( '<tr><th style="width:180px">Form</th><td>%s</td></tr>', esc_html( isset( self::FORMS[ $form ] ) ? self::FORMS[ $form ] : $form ) );
		printf( '<tr><th>Received</th><td>%s</td></tr>', esc_html( get_the_date( 'j M Y, g:i a', $post ) ) );
		foreach ( $fields as $key => $value ) {
			if ( 'phone' === $key ) {
				$value = sprintf( '<a href="tel:+91%1$s">+91 %1$s</a>', esc_attr( $value ) );
			} elseif ( 'email' === $key ) {
				$value = sprintf( '<a href="mailto:%1$s">%1$s</a>', esc_attr( $value ) );
			} else {
				$value = nl2br( esc_html( $value ) );
			}
			printf( '<tr><th>%s</th><td>%s</td></tr>', esc_html( self::label( $key ) ), $value ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above
		}
		if ( $source ) {
			printf( '<tr><th>Sent from</th><td>%s</td></tr>', esc_html( $source ) );
		}
		echo '</tbody></table>';
	}

	public static function columns( $columns ) {
		return array(
			'cb'         => $columns['cb'],
			'title'      => 'Name',
			'venu_form'  => 'Form',
			'venu_phone' => 'Phone',
			'venu_model' => 'Model',
			'venu_place' => 'City / PIN',
			'date'       => 'Received',
		);
	}

	public static function column( $column, $post_id ) {
		$fields = (array) get_post_meta( $post_id, '_venu_fields', true );
		switch ( $column ) {
			case 'venu_form':
				$form = get_post_meta( $post_id, '_venu_form', true );
				echo esc_html( isset( self::FORMS[ $form ] ) ? self::FORMS[ $form ] : $form );
				break;
			case 'venu_phone':
				$phone = get_post_meta( $post_id, '_venu_phone', true );
				printf( '<a href="tel:+91%1$s">%1$s</a>', esc_attr( $phone ) );
				break;
			case 'venu_model':
				echo esc_html( get_post_meta( $post_id, '_venu_model', true ) );
				break;
			case 'venu_place':
				$place = array();
				foreach ( array( 'city', 'pin', 'pincode' ) as $key ) {
					if ( ! empty( $fields[ $key ] ) ) {
						$place[] = $fields[ $key ];
					}
				}
				echo esc_html( implode( ' · ', $place ) );
				break;
		}
	}

	/** Form filter and CSV button above the Leads list. */
	public static function filters( $post_type ) {
		if ( self::POST_TYPE !== $post_type ) {
			return;
		}
		$current = isset( $_GET['venu_form'] ) ? sanitize_key( $_GET['venu_form'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		echo '<select name="venu_form"><option value="">All forms</option>';
		foreach ( self::FORMS as $key => $label ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $key ), selected( $current, $key, false ), esc_html( $label ) );
		}
		echo '</select>';
		$url = wp_nonce_url( admin_url( 'admin-post.php?action=venu_leads_csv' . ( $current ? '&venu_form=' . $current : '' ) ), 'venu_leads_csv' );
		printf( ' <a class="button" href="%s" style="margin-left:4px">Download CSV</a>', esc_url( $url ) );
	}

	public static function apply_filter( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() || self::POST_TYPE !== $query->get( 'post_type' ) || empty( $_GET['venu_form'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}
		$query->set( 'meta_key', '_venu_form' ); // phpcs:ignore WordPress.DB.SlowDBQuery
		$query->set( 'meta_value', sanitize_key( $_GET['venu_form'] ) ); // phpcs:ignore WordPress.Security.NonceVerification, WordPress.DB.SlowDBQuery
	}

	public static function export_csv() {
		if ( ! current_user_can( 'edit_venu_leads' ) ) {
			wp_die( 'You are not allowed to do that.' );
		}
		check_admin_referer( 'venu_leads_csv' );

		$args = array(
			'post_type'   => self::POST_TYPE,
			'post_status' => 'publish',
			'numberposts' => -1,
			'orderby'     => 'date',
			'order'       => 'DESC',
		);
		$form = isset( $_GET['venu_form'] ) ? sanitize_key( $_GET['venu_form'] ) : '';
		if ( $form ) {
			$args['meta_key']   = '_venu_form'; // phpcs:ignore WordPress.DB.SlowDBQuery
			$args['meta_value'] = $form; // phpcs:ignore WordPress.DB.SlowDBQuery
		}
		$leads = get_posts( $args );

		// Every field any lead has, so dealership and offers leads share one sheet.
		$keys = array();
		foreach ( $leads as $lead ) {
			$keys = array_merge( $keys, array_keys( (array) get_post_meta( $lead->ID, '_venu_fields', true ) ) );
		}
		$keys = array_values( array_unique( $keys ) );

		nocache_headers();
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=venu-leads-' . gmdate( 'Y-m-d' ) . '.csv' );
		$out = fopen( 'php://output', 'w' );
		fwrite( $out, "\xEF\xBB\xBF" ); // Excel opens UTF-8 correctly with a BOM
		fputcsv( $out, array_merge( array( 'Received', 'Form' ), array_map( array( __CLASS__, 'label' ), $keys ) ) );
		foreach ( $leads as $lead ) {
			$fields = (array) get_post_meta( $lead->ID, '_venu_fields', true );
			$form_k = get_post_meta( $lead->ID, '_venu_form', true );
			$row    = array( get_the_date( 'Y-m-d H:i', $lead ), isset( self::FORMS[ $form_k ] ) ? self::FORMS[ $form_k ] : $form_k );
			foreach ( $keys as $key ) {
				$value = isset( $fields[ $key ] ) ? $fields[ $key ] : '';
				// Stop spreadsheet apps treating a value as a formula.
				if ( '' !== $value && in_array( $value[0], array( '=', '+', '-', '@' ), true ) ) {
					$value = "'" . $value;
				}
				$row[] = $value;
			}
			fputcsv( $out, $row );
		}
		fclose( $out );
		exit;
	}
}
