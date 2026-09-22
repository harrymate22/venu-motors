<?php
/**
 * Settings screen: Venu Shop in the WordPress admin menu.
 *
 * Everything the plugin needs to know about the outside world lives here — the
 * main website's address, who gets lead emails, and whether shoppers should be
 * forwarded back to the main site. The same screen runs the catalogue sync.
 */

defined( 'ABSPATH' ) || exit;

class Venu_Shop_Settings {

	const OPTION = 'venu_shop_settings';
	const SLUG   = 'venu-shop';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
		add_action( 'admin_post_venu_shop_sync', array( __CLASS__, 'handle_sync' ) );
		add_filter( 'plugin_action_links_' . plugin_basename( VENU_SHOP_FILE ), array( __CLASS__, 'action_links' ) );
		// Let wp_safe_redirect() send shoppers to the main website.
		add_filter( 'allowed_redirect_hosts', array( __CLASS__, 'allow_site_host' ) );
	}

	/** Who may use the Venu Shop screens (and read leads). */
	public static function capability() {
		return class_exists( 'WooCommerce' ) ? 'manage_woocommerce' : 'manage_options';
	}

	public static function defaults() {
		return array(
			'site_url'            => 'https://venumotors.in',
			'lead_email'          => get_option( 'admin_email' ),
			'catalog_url'         => '',
			'redirect_storefront' => 1,
			'confirm_redirect'    => 1,
		);
	}

	public static function all() {
		return wp_parse_args( (array) get_option( self::OPTION, array() ), self::defaults() );
	}

	public static function get( $key ) {
		$all = self::all();
		return isset( $all[ $key ] ) ? $all[ $key ] : null;
	}

	/** The main website, e.g. site_url( '/thunder' ) → https://venumotors.in/thunder */
	public static function site_url( $path = '' ) {
		return untrailingslashit( (string) self::get( 'site_url' ) ) . $path;
	}

	/** Where "Sync from website" reads the price list. */
	public static function catalog_url() {
		$url = (string) self::get( 'catalog_url' );
		return $url ? $url : self::site_url( '/shop-catalog.json' );
	}

	public static function allow_site_host( $hosts ) {
		$host = wp_parse_url( self::site_url(), PHP_URL_HOST );
		if ( $host ) {
			$hosts[] = $host;
			// Cover both venumotors.in and www.venumotors.in.
			$hosts[] = 0 === strpos( $host, 'www.' ) ? substr( $host, 4 ) : 'www.' . $host;
		}
		return $hosts;
	}

	public static function action_links( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ) . '">Settings</a>' );
		return $links;
	}

	public static function menu() {
		add_menu_page(
			'Venu Shop',
			'Venu Shop',
			self::capability(),
			self::SLUG,
			array( __CLASS__, 'render' ),
			'dashicons-store',
			56
		);
		add_submenu_page( self::SLUG, 'Venu Shop settings', 'Settings', self::capability(), self::SLUG, array( __CLASS__, 'render' ) );
	}

	public static function register() {
		register_setting(
			'venu_shop',
			self::OPTION,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( __CLASS__, 'sanitize' ),
				'default'           => self::defaults(),
			)
		);
	}

	public static function sanitize( $input ) {
		$input = (array) $input;
		$out   = self::defaults();

		$site = isset( $input['site_url'] ) ? esc_url_raw( trim( $input['site_url'] ) ) : '';
		if ( $site ) {
			$out['site_url'] = untrailingslashit( $site );
		} else {
			add_settings_error( self::OPTION, 'site_url', 'Enter the main website address, e.g. https://venumotors.in' );
		}

		$emails = array();
		foreach ( explode( ',', isset( $input['lead_email'] ) ? $input['lead_email'] : '' ) as $email ) {
			$email = sanitize_email( trim( $email ) );
			if ( $email && is_email( $email ) ) {
				$emails[] = $email;
			}
		}
		if ( $emails ) {
			$out['lead_email'] = implode( ', ', $emails );
		}

		$out['catalog_url']         = isset( $input['catalog_url'] ) ? esc_url_raw( trim( $input['catalog_url'] ) ) : '';
		$out['redirect_storefront'] = empty( $input['redirect_storefront'] ) ? 0 : 1;
		$out['confirm_redirect']    = empty( $input['confirm_redirect'] ) ? 0 : 1;

		return $out;
	}

	/** Runs the catalogue sync from the settings screen's buttons. */
	public static function handle_sync() {
		if ( ! current_user_can( self::capability() ) ) {
			wp_die( 'You are not allowed to do that.' );
		}
		check_admin_referer( 'venu_shop_sync' );

		$source = isset( $_POST['source'] ) && 'bundled' === $_POST['source'] ? 'bundled' : 'site';
		$result = Venu_Shop_Catalog::sync_from( $source );

		update_option( 'venu_shop_last_sync', $result, false );
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::SLUG . '&synced=1' ) );
		exit;
	}

	public static function render() {
		if ( ! current_user_can( self::capability() ) ) {
			return;
		}
		$s    = self::all();
		$last = get_option( 'venu_shop_last_sync' );
		$name = self::OPTION;
		?>
		<div class="wrap">
			<h1>Venu Shop</h1>
			<p>Connects <strong><?php echo esc_html( self::site_url() ); ?></strong> to this WooCommerce store: every scooter is sold at its own price through a one-page checkout, and the website's forms land in <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . Venu_Shop_Leads::POST_TYPE ) ); ?>">Leads</a>.</p>

			<?php settings_errors( self::OPTION ); ?>

			<?php if ( is_array( $last ) ) : ?>
				<div class="notice <?php echo empty( $last['errors'] ) ? 'notice-success' : 'notice-warning'; ?>">
					<p><strong>Last catalogue sync:</strong> <?php echo esc_html( $last['summary'] ); ?>
					<span style="color:#666"> — <?php echo esc_html( $last['time'] ); ?>, from <?php echo esc_html( $last['source'] ); ?></span></p>
					<?php if ( ! empty( $last['errors'] ) ) : ?>
						<ul style="list-style:disc;margin-left:20px">
							<?php foreach ( $last['errors'] as $error ) : ?>
								<li><?php echo esc_html( $error ); ?></li>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<h2>1. Catalogue</h2>
			<p>Creates or updates one WooCommerce product per scooter model, with a variation for every colour × battery at the price on the website. Run it again whenever prices, colours or battery options change on the website.</p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:flex;gap:8px;flex-wrap:wrap">
				<?php wp_nonce_field( 'venu_shop_sync' ); ?>
				<input type="hidden" name="action" value="venu_shop_sync">
				<button class="button button-primary" name="source" value="site">Sync from website</button>
				<button class="button" name="source" value="bundled">Sync from the plugin's built-in copy</button>
			</form>
			<p class="description">"Sync from website" reads <code><?php echo esc_html( self::catalog_url() ); ?></code>, which the website publishes on every build.</p>

			<h2 style="margin-top:32px">2. Settings</h2>
			<form method="post" action="options.php">
				<?php settings_fields( 'venu_shop' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="venu-site-url">Main website</label></th>
						<td>
							<input id="venu-site-url" class="regular-text" type="url" name="<?php echo esc_attr( $name ); ?>[site_url]" value="<?php echo esc_attr( $s['site_url'] ); ?>" required>
							<p class="description">Where the React site lives. Shoppers are sent back here after paying.</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="venu-lead-email">Send new leads to</label></th>
						<td>
							<input id="venu-lead-email" class="regular-text" type="text" name="<?php echo esc_attr( $name ); ?>[lead_email]" value="<?php echo esc_attr( $s['lead_email'] ); ?>">
							<p class="description">One or more email addresses, separated by commas.</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="venu-catalog-url">Catalogue address</label></th>
						<td>
							<input id="venu-catalog-url" class="regular-text" type="url" name="<?php echo esc_attr( $name ); ?>[catalog_url]" value="<?php echo esc_attr( $s['catalog_url'] ); ?>" placeholder="<?php echo esc_attr( self::site_url( '/shop-catalog.json' ) ); ?>">
							<p class="description">Leave empty to use the default shown in grey.</p>
						</td>
					</tr>
					<tr>
						<th scope="row">Shop pages</th>
						<td>
							<label><input type="checkbox" name="<?php echo esc_attr( $name ); ?>[redirect_storefront]" value="1" <?php checked( $s['redirect_storefront'] ); ?>>
							Send visitors of this store's home, shop, product and cart pages to the main website</label>
							<p class="description">Keeps the store to a single page — checkout. Customers can still reach My account.</p>
						</td>
					</tr>
					<tr>
						<th scope="row">After payment</th>
						<td>
							<label><input type="checkbox" name="<?php echo esc_attr( $name ); ?>[confirm_redirect]" value="1" <?php checked( $s['confirm_redirect'] ); ?>>
							Show the order confirmation on the main website (<code><?php echo esc_html( self::site_url( '/order-confirmed' ) ); ?></code>)</label>
							<p class="description">Untick to keep WooCommerce's own thank-you page — for example if a tracking plugin needs to fire there.</p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>

			<h2>How a purchase flows</h2>
			<ol style="list-style:decimal;margin-left:20px">
				<li>On the website, the buyer picks colour, battery and city, then taps <strong>Buy now</strong>.</li>
				<li>This store empties the cart, adds exactly that scooter at its own price, and opens <a href="<?php echo esc_url( venu_shop_checkout_url() ); ?>">Checkout</a> directly.</li>
				<li>They pay (Razorpay), WooCommerce emails you and them, and they land on the website's confirmation page.</li>
			</ol>
		</div>
		<?php
	}
}

/** Checkout URL that also works while WooCommerce is inactive. */
function venu_shop_checkout_url() {
	return function_exists( 'wc_get_checkout_url' ) ? wc_get_checkout_url() : home_url( '/checkout/' );
}
