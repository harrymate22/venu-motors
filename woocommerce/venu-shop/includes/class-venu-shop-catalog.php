<?php
/**
 * Catalogue sync: website price list → WooCommerce products.
 *
 * The React site's bikes.js is the one place prices, colours and battery packs
 * are written down. Its build publishes them as /shop-catalog.json; this class
 * reads that file and makes WooCommerce match it:
 *
 *   one variable product per model      SKU  VENU-THUNDER
 *   one variation per colour × battery  SKU  VENU-THUNDER-BLUE-60V-32AH   price ₹45,000
 *
 * SKUs are how the two sides find each other — the "Buy now" link carries the
 * model, colour and battery ids and the checkout looks the variation up by SKU —
 * so don't edit Venu SKUs by hand. Prices, on the other hand, are overwritten on
 * every sync; change them in bikes.js, not here.
 *
 * Nothing is ever deleted. A colour or battery that leaves the catalogue has its
 * variation switched to private (no longer purchasable); a model that leaves it
 * goes back to draft. Re-adding it brings the same product back.
 */

defined( 'ABSPATH' ) || exit;

class Venu_Shop_Catalog {

	const META_SLUG  = '_venu_slug';
	const ATTR_COLOUR  = 'Colour';
	const ATTR_BATTERY = 'Battery';

	public static function init() {
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			WP_CLI::add_command( 'venu sync', array( __CLASS__, 'cli_sync' ) );
		}
	}

	public static function product_sku( $slug ) {
		return strtoupper( 'venu-' . $slug );
	}

	/** Ids are the lowercase-hyphenated ids the website sends, e.g. ( thunder, gray-silver, 60v-32ah ). */
	public static function variation_sku( $slug, $colour_id, $battery_id ) {
		return strtoupper( 'venu-' . $slug . '-' . $colour_id . '-' . $battery_id );
	}

	/**
	 * Loads the catalogue from the website ('site'), the copy shipped inside this
	 * plugin ('bundled'), or a file path (WP-CLI), then syncs it.
	 *
	 * @return array Result for the settings screen: summary, errors, time, source.
	 */
	public static function sync_from( $source ) {
		$label   = $source;
		$catalog = null;

		if ( 'site' === $source ) {
			$url      = Venu_Shop_Settings::catalog_url();
			$label    = $url;
			$response = wp_remote_get(
				add_query_arg( 'v', time(), $url ), // skip any CDN cache
				array( 'timeout' => 20 )
			);
			if ( is_wp_error( $response ) ) {
				return self::result( $label, 'Could not reach the website.', array( $response->get_error_message() ) );
			}
			if ( 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
				return self::result( $label, 'The website did not return the catalogue.', array( 'HTTP ' . wp_remote_retrieve_response_code( $response ) . ' from ' . $url . ' — has the latest website build been uploaded?' ) );
			}
			$catalog = json_decode( wp_remote_retrieve_body( $response ), true );
		} else {
			$path  = 'bundled' === $source ? VENU_SHOP_DIR . 'catalog.json' : $source;
			$label = 'bundled' === $source ? 'the plugin\'s built-in copy' : $path;
			if ( ! is_readable( $path ) ) {
				return self::result( $label, 'Catalogue file not found.', array( $path ) );
			}
			$catalog = json_decode( (string) file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		}

		$problem = self::validate( $catalog );
		if ( $problem ) {
			return self::result( $label, 'The catalogue was not usable, so nothing was changed.', array( $problem ) );
		}

		return self::sync( $catalog, $label );
	}

	/** @return string|null What is wrong with the catalogue, or null if it is fine. */
	public static function validate( $catalog ) {
		if ( ! is_array( $catalog ) || empty( $catalog['models'] ) || ! is_array( $catalog['models'] ) ) {
			return 'No models found — expected JSON with a "models" list.';
		}
		foreach ( $catalog['models'] as $i => $model ) {
			$where = 'Model #' . ( $i + 1 );
			if ( empty( $model['slug'] ) || empty( $model['name'] ) ) {
				return $where . ' is missing its slug or name.';
			}
			$where = $model['name'];
			if ( empty( $model['colours'] ) || empty( $model['packs'] ) ) {
				return $where . ' has no colours or no battery packs.';
			}
			foreach ( $model['colours'] as $colour ) {
				if ( empty( $colour['id'] ) || empty( $colour['name'] ) ) {
					return $where . ' has a colour without an id or name.';
				}
			}
			foreach ( $model['packs'] as $pack ) {
				if ( empty( $pack['id'] ) || empty( $pack['label'] ) || ! isset( $pack['price'] ) || ! is_numeric( $pack['price'] ) || $pack['price'] <= 0 ) {
					return $where . ' has a battery pack without an id, label or valid price.';
				}
			}
		}
		return null;
	}

	/**
	 * Makes WooCommerce match the catalogue.
	 *
	 * @param array  $catalog Validated catalogue.
	 * @param string $label   Where it came from, for the result message.
	 */
	public static function sync( array $catalog, $label = '' ) {
		$stats  = array(
			'models_created'     => 0,
			'models_updated'     => 0,
			'variations_created' => 0,
			'variations_updated' => 0,
			'variations_hidden'  => 0,
			'models_retired'     => 0,
		);
		$errors = array();
		$slugs  = array();

		foreach ( $catalog['models'] as $model ) {
			$slugs[] = sanitize_title( $model['slug'] );
			try {
				self::sync_model( $model, $stats, $errors );
			} catch ( Exception $e ) {
				$errors[] = $model['name'] . ': ' . $e->getMessage();
			}
		}

		// Models we created earlier that the catalogue no longer lists → draft.
		$ours = get_posts(
			array(
				'post_type'   => 'product',
				'post_status' => array( 'publish', 'private' ),
				'numberposts' => -1,
				'fields'      => 'ids',
				'meta_key'    => self::META_SLUG, // phpcs:ignore WordPress.DB.SlowDBQuery
			)
		);
		foreach ( $ours as $product_id ) {
			if ( in_array( get_post_meta( $product_id, self::META_SLUG, true ), $slugs, true ) ) {
				continue;
			}
			$product = wc_get_product( $product_id );
			if ( $product ) {
				$product->set_status( 'draft' );
				$product->save();
				$stats['models_retired']++;
			}
		}

		$summary = sprintf(
			'%d models (%d new), %d colour × battery options (%d new, %d updated, %d switched off)%s.',
			count( $catalog['models'] ),
			$stats['models_created'],
			$stats['variations_created'] + $stats['variations_updated'],
			$stats['variations_created'],
			$stats['variations_updated'],
			$stats['variations_hidden'],
			$stats['models_retired'] ? sprintf( ', %d retired model(s) moved to draft', $stats['models_retired'] ) : ''
		);

		return self::result( $label, $summary, $errors, $stats );
	}

	private static function sync_model( array $model, array &$stats, array &$errors ) {
		$slug = sanitize_title( $model['slug'] );
		$sku  = self::product_sku( $slug );
		$id   = wc_get_product_id_by_sku( $sku );

		if ( $id ) {
			$product = wc_get_product( $id );
			if ( ! $product || ! $product->is_type( 'variable' ) ) {
				$errors[] = $model['name'] . ': SKU ' . $sku . ' belongs to a product that is not a variable product — rename that SKU and sync again.';
				return;
			}
			$stats['models_updated']++;
		} else {
			$product = new WC_Product_Variable();
			$product->set_sku( $sku );
			$stats['models_created']++;
		}

		$colour_names = wp_list_pluck( $model['colours'], 'name' );
		$pack_labels  = wp_list_pluck( $model['packs'], 'label' );

		$product->set_name( $model['name'] );
		$product->set_status( 'publish' );
		$product->set_sold_individually( true ); // one scooter per order
		$product->set_short_description( isset( $model['tagline'] ) ? wp_kses_post( $model['tagline'] ) : '' );
		$product->set_description( isset( $model['description'] ) ? wp_kses_post( $model['description'] ) : '' );
		$product->set_attributes(
			array(
				self::attribute( self::ATTR_COLOUR, $colour_names, 0 ),
				self::attribute( self::ATTR_BATTERY, $pack_labels, 1 ),
			)
		);
		$product->update_meta_data( self::META_SLUG, $slug );
		$product_id = $product->save();

		if ( ! empty( $model['image'] ) && ! $product->get_image_id() ) {
			$image_id = self::sideload_image( $model['image'], $product_id, $model['name'] );
			if ( is_wp_error( $image_id ) ) {
				$errors[] = $model['name'] . ': photo not imported (' . $image_id->get_error_message() . ') — you can set it by hand; the sale still works.';
			} else {
				$product->set_image_id( $image_id );
				$product->save();
			}
		}

		// One variation per colour × battery.
		$keep = array();
		foreach ( $model['colours'] as $colour ) {
			foreach ( $model['packs'] as $pack ) {
				$v_sku = self::variation_sku( $slug, sanitize_title( $colour['id'] ), sanitize_title( $pack['id'] ) );
				$v_id  = wc_get_product_id_by_sku( $v_sku );
				$var   = $v_id ? wc_get_product( $v_id ) : null;

				if ( $var && ( ! $var->is_type( 'variation' ) || (int) $var->get_parent_id() !== (int) $product_id ) ) {
					$errors[] = $model['name'] . ': SKU ' . $v_sku . ' is already used by another product — skipped.';
					continue;
				}
				if ( $var ) {
					$stats['variations_updated']++;
				} else {
					$var = new WC_Product_Variation();
					$var->set_parent_id( $product_id );
					$var->set_sku( $v_sku );
					// No shipping step at checkout: the scooter is handed over by the
					// dealership in the buyer's city. Untick "Virtual" on a variation
					// if you later add shipping — the sync won't set it back.
					$var->set_virtual( true );
					$stats['variations_created']++;
				}

				$var->set_attributes(
					array(
						sanitize_title( self::ATTR_COLOUR )  => $colour['name'],
						sanitize_title( self::ATTR_BATTERY ) => $pack['label'],
					)
				);
				$var->set_regular_price( (string) round( (float) $pack['price'], 2 ) );
				$var->set_sale_price( '' );
				$var->set_status( 'publish' );
				$keep[] = $var->save();
			}
		}

		// Options that left the catalogue can no longer be bought.
		$children = get_posts(
			array(
				'post_type'   => 'product_variation',
				'post_parent' => $product_id,
				'post_status' => array( 'publish', 'private' ),
				'numberposts' => -1,
				'fields'      => 'ids',
			)
		);
		foreach ( $children as $child_id ) {
			if ( in_array( (int) $child_id, array_map( 'intval', $keep ), true ) ) {
				continue;
			}
			$child = wc_get_product( $child_id );
			if ( $child && 'private' !== $child->get_status() ) {
				$child->set_status( 'private' );
				$child->save();
				$stats['variations_hidden']++;
			}
		}

		WC_Product_Variable::sync( $product_id );
		wc_delete_product_transients( $product_id );
	}

	private static function attribute( $name, array $options, $position ) {
		$attribute = new WC_Product_Attribute();
		$attribute->set_id( 0 ); // a product-level attribute, not a global taxonomy
		$attribute->set_name( $name );
		$attribute->set_options( array_values( array_unique( $options ) ) );
		$attribute->set_position( $position );
		$attribute->set_visible( true );
		$attribute->set_variation( true );
		return $attribute;
	}

	/** Imports the model photo from the website into the media library. */
	private static function sideload_image( $url, $product_id, $name ) {
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		return media_sideload_image( $url, $product_id, $name, 'id' );
	}

	private static function result( $source, $summary, array $errors = array(), array $stats = array() ) {
		return array(
			'source'  => $source,
			'summary' => $summary,
			'errors'  => $errors,
			'stats'   => $stats,
			'time'    => wp_date( 'j M Y, g:i a' ),
		);
	}

	/**
	 * Syncs the WooCommerce products with the website's catalogue.
	 *
	 * ## OPTIONS
	 *
	 * [--source=<source>]
	 * : "site" (default) reads the website's /shop-catalog.json, "bundled" the
	 * plugin's copy, anything else is read as a file path.
	 *
	 * ## EXAMPLES
	 *
	 *     wp venu sync
	 *     wp venu sync --source=bundled
	 *
	 * @param array $args       Positional args (unused).
	 * @param array $assoc_args Named args.
	 */
	public static function cli_sync( $args, $assoc_args ) {
		$source = isset( $assoc_args['source'] ) ? $assoc_args['source'] : 'site';
		$result = self::sync_from( $source );
		update_option( 'venu_shop_last_sync', $result, false );

		foreach ( $result['errors'] as $error ) {
			WP_CLI::warning( $error );
		}
		if ( empty( $result['stats'] ) ) {
			WP_CLI::error( $result['summary'] );
		}
		WP_CLI::success( $result['summary'] );
	}
}
