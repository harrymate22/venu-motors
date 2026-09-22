<?php
/**
 * The one-page order.
 *
 * The store is only ever seen through its checkout page. A "Buy now" link from
 * the website lands here, the cart is replaced with exactly that scooter at its
 * own price, and the buyer goes straight to checkout — there is no cart step and
 * no shop to browse. After payment they're forwarded to the website's
 * confirmation page.
 *
 *   /?venu_buy=thunder&colour=blue&battery=60v-32ah&city=Hyderabad
 */

defined( 'ABSPATH' ) || exit;

class Venu_Shop_Checkout {

	/** Cart item key for the city the buyer picked on the website. */
	const CITY_KEY = 'venu_city';

	/** Order item meta label — shown as-is in admin, emails and the order page. */
	const CITY_LABEL = 'Delivery city';

	public static function init() {
		add_action( 'template_redirect', array( __CLASS__, 'handle_buy_link' ), 5 );
		add_action( 'template_redirect', array( __CLASS__, 'redirect_storefront' ), 6 ); // before WooCommerce's own empty-checkout → cart hop
		// After WooCommerce empties the cart for a paid order (priority 20).
		add_action( 'template_redirect', array( __CLASS__, 'redirect_after_payment' ), 99 );

		add_filter( 'woocommerce_get_item_data', array( __CLASS__, 'show_city_in_cart' ), 10, 2 );
		add_action( 'woocommerce_checkout_create_order_line_item', array( __CLASS__, 'save_city_on_order' ), 10, 3 );

		// Product names in checkout and emails link to the model page on the website.
		add_filter( 'woocommerce_cart_item_permalink', array( __CLASS__, 'cart_item_link' ), 10, 2 );
		add_filter( 'woocommerce_order_item_permalink', array( __CLASS__, 'order_item_link' ), 10, 2 );
		add_filter( 'woocommerce_return_to_shop_redirect', array( __CLASS__, 'home' ) );
		add_filter( 'woocommerce_continue_shopping_redirect', array( __CLASS__, 'home' ) );

		// Classic checkout only (the checkout block has its own field settings).
		add_filter( 'woocommerce_checkout_fields', array( __CLASS__, 'trim_fields' ) );
	}

	public static function home() {
		return Venu_Shop_Settings::site_url( '/' );
	}

	/** Reads a query-string value as a lowercase-hyphenated id. */
	private static function id_param( $key ) {
		return isset( $_GET[ $key ] ) ? sanitize_title( wp_unslash( $_GET[ $key ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	}

	/**
	 * Buy-now link → cart with exactly one scooter → checkout.
	 *
	 * No nonce: like WooCommerce's own ?add-to-cart links, the worst a forged link
	 * can do is put a scooter in someone's cart. Nothing is charged without the
	 * buyer completing checkout.
	 */
	public static function handle_buy_link() {
		if ( ! isset( $_GET['venu_buy'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}

		$slug    = self::id_param( 'venu_buy' );
		$colour  = self::id_param( 'colour' );
		$battery = self::id_param( 'battery' );
		$city    = isset( $_GET['city'] ) ? substr( sanitize_text_field( wp_unslash( $_GET['city'] ) ), 0, 60 ) : ''; // phpcs:ignore WordPress.Security.NonceVerification

		$back = Venu_Shop_Settings::site_url( $slug ? '/' . $slug : '/' );

		$variation_id = ( $slug && $colour && $battery )
			? wc_get_product_id_by_sku( Venu_Shop_Catalog::variation_sku( $slug, $colour, $battery ) )
			: 0;
		$variation    = $variation_id ? wc_get_product( $variation_id ) : null;

		if ( ! $variation || ! $variation->is_type( 'variation' ) || 'publish' !== $variation->get_status() || ! $variation->is_purchasable() || ! $variation->is_in_stock() ) {
			self::leave( add_query_arg( 'order', 'unavailable', $back ) );
		}

		$cart_data = $city ? array( self::CITY_KEY => $city ) : array();

		WC()->cart->empty_cart();
		$added = WC()->cart->add_to_cart(
			$variation->get_parent_id(),
			1,
			$variation_id,
			wc_get_product_variation_attributes( $variation_id ),
			$cart_data
		);
		wc_clear_notices(); // no "added to your cart" banner on checkout

		if ( ! $added ) {
			self::leave( add_query_arg( 'order', 'unavailable', $back ) );
		}

		// Start with the city filled in on the billing address.
		if ( $city && WC()->customer && ! WC()->customer->get_billing_city() ) {
			WC()->customer->set_billing_city( $city );
			WC()->customer->save();
		}

		// A guest has no session cookie yet; without one the cart is lost on redirect.
		if ( WC()->session && method_exists( WC()->session, 'set_customer_session_cookie' ) ) {
			WC()->session->set_customer_session_cookie( true );
		}

		nocache_headers();
		wp_safe_redirect( wc_get_checkout_url() );
		exit;
	}

	/** Everything except checkout (and My account) goes back to the website. */
	public static function redirect_storefront() {
		if ( ! Venu_Shop_Settings::get( 'redirect_storefront' ) || is_admin() || wp_doing_ajax() ) {
			return;
		}

		if ( function_exists( 'is_cart' ) && is_cart() ) {
			self::leave( WC()->cart && ! WC()->cart->is_empty() ? wc_get_checkout_url() : self::home() );
		}

		if ( is_checkout() && ! is_wc_endpoint_url( 'order-received' ) && ! is_wc_endpoint_url( 'order-pay' ) ) {
			if ( WC()->cart && WC()->cart->is_empty() ) {
				self::leave( self::home() );
			}
			return;
		}

		if ( is_product() ) {
			$slug = get_post_meta( get_queried_object_id(), Venu_Shop_Catalog::META_SLUG, true );
			self::leave( Venu_Shop_Settings::site_url( $slug ? '/' . $slug : '/' ) );
		}

		if ( is_shop() || is_product_taxonomy() || is_front_page() || is_home() ) {
			self::leave( self::home() );
		}
	}

	/** Paid (or awaiting payment) → the website's confirmation page. */
	public static function redirect_after_payment() {
		if ( ! Venu_Shop_Settings::get( 'confirm_redirect' ) || ! is_wc_endpoint_url( 'order-received' ) ) {
			return;
		}

		$order_id = absint( get_query_var( 'order-received' ) );
		$key      = isset( $_GET['key'] ) ? wc_clean( wp_unslash( $_GET['key'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		$order    = $order_id ? wc_get_order( $order_id ) : null;

		// Only the buyer holds the order key. Failed or cancelled orders stay here,
		// where WooCommerce offers to retry the payment.
		if ( ! $order || ! $key || ! $order->key_is_valid( $key ) || $order->has_status( array( 'failed', 'cancelled' ) ) ) {
			return;
		}

		$details = self::order_details( $order );
		$args    = array(
			'order'   => $order->get_order_number(),
			// "paid" only once the payment gateway confirms (Razorpay does); cash on
			// delivery stays "processing", bank transfer "on-hold".
			'status'  => $order->get_date_paid() ? 'paid' : $order->get_status(),
			'total'   => wc_format_decimal( $order->get_total(), 0 ),
			'model'   => $details['slug'],
			'colour'  => $details['colour'],
			'battery' => $details['battery'],
			'city'    => $details['city'],
		);

		// Only order facts travel in the URL — never the buyer's name, phone or email.
		self::leave( add_query_arg( urlencode_deep( array_filter( $args, 'strlen' ) ), Venu_Shop_Settings::site_url( '/order-confirmed' ) ) );
	}

	/** Model slug, colour, battery and city from an order's scooter line. */
	public static function order_details( WC_Order $order ) {
		$out = array(
			'slug'    => '',
			'colour'  => '',
			'battery' => '',
			'city'    => '',
		);
		foreach ( $order->get_items() as $item ) {
			if ( ! $item instanceof WC_Order_Item_Product ) {
				continue;
			}
			$out['slug']    = (string) get_post_meta( $item->get_product_id(), Venu_Shop_Catalog::META_SLUG, true );
			$out['colour']  = (string) $item->get_meta( sanitize_title( Venu_Shop_Catalog::ATTR_COLOUR ) );
			$out['battery'] = (string) $item->get_meta( sanitize_title( Venu_Shop_Catalog::ATTR_BATTERY ) );
			$out['city']    = (string) $item->get_meta( self::CITY_LABEL );
			break;
		}
		return $out;
	}

	public static function show_city_in_cart( $item_data, $cart_item ) {
		if ( ! empty( $cart_item[ self::CITY_KEY ] ) ) {
			$item_data[] = array(
				'key'   => self::CITY_LABEL,
				'value' => $cart_item[ self::CITY_KEY ],
			);
		}
		return $item_data;
	}

	public static function save_city_on_order( $item, $cart_item_key, $values ) {
		if ( ! empty( $values[ self::CITY_KEY ] ) ) {
			$item->add_meta_data( self::CITY_LABEL, $values[ self::CITY_KEY ], true );
		}
	}

	private static function model_url( $product_id ) {
		$slug = get_post_meta( $product_id, Venu_Shop_Catalog::META_SLUG, true );
		return $slug ? Venu_Shop_Settings::site_url( '/' . $slug ) : '';
	}

	public static function cart_item_link( $permalink, $cart_item ) {
		$url = isset( $cart_item['product_id'] ) ? self::model_url( $cart_item['product_id'] ) : '';
		return $url ? $url : $permalink;
	}

	public static function order_item_link( $permalink, $item ) {
		$url = is_callable( array( $item, 'get_product_id' ) ) ? self::model_url( $item->get_product_id() ) : '';
		return $url ? $url : $permalink;
	}

	/** Classic checkout: drop the company field — buyers are individuals. */
	public static function trim_fields( $fields ) {
		unset( $fields['billing']['billing_company'], $fields['shipping']['shipping_company'] );
		return $fields;
	}

	private static function leave( $url ) {
		nocache_headers();
		wp_safe_redirect( $url, 302, 'Venu Shop' );
		exit;
	}
}
