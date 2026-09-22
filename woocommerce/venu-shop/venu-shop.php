<?php
/**
 * Plugin Name:       Venu Shop
 * Description:       Connects the Venu Motors website to WooCommerce — a one-page "Buy now" checkout for every scooter at its own price, and lead capture from the site's forms.
 * Version:           1.0.0
 * Author:            TryBINC Network
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Requires Plugins:  woocommerce
 * WC requires at least: 8.0
 * Text Domain:       venu-shop
 *
 * How the pieces fit:
 *
 *   venumotors.in (React)                 shop.venumotors.in (this plugin)
 *   ─────────────────────                 ────────────────────────────────
 *   /thunder/book  "Buy now"  ──────────▶ /?venu_buy=thunder&colour=blue&battery=60v-32ah&city=…
 *                                          empties the cart, adds that exact scooter at its
 *                                          own price, jumps straight to the one-page checkout
 *                                          (Razorpay)
 *   /order-confirmed          ◀────────── after payment, the thank-you page forwards here
 *   Home + dealership forms   ──────────▶ POST /wp-json/venu/v1/leads → Venu Shop › Leads + email
 *   /shop-catalog.json        ──────────▶ "Sync catalogue" builds the products from the website's
 *                                          own price list, so prices live in one place (bikes.js)
 */

defined( 'ABSPATH' ) || exit;

define( 'VENU_SHOP_VERSION', '1.0.0' );
define( 'VENU_SHOP_FILE', __FILE__ );
define( 'VENU_SHOP_DIR', plugin_dir_path( __FILE__ ) );

require_once VENU_SHOP_DIR . 'includes/class-venu-shop-settings.php';
require_once VENU_SHOP_DIR . 'includes/class-venu-shop-leads.php';
require_once VENU_SHOP_DIR . 'includes/class-venu-shop-catalog.php';
require_once VENU_SHOP_DIR . 'includes/class-venu-shop-checkout.php';

// Declare compatibility with WooCommerce's order tables (HPOS) and block checkout.
add_action(
	'before_woocommerce_init',
	function () {
		if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', VENU_SHOP_FILE, true );
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', VENU_SHOP_FILE, true );
		}
	}
);

Venu_Shop_Settings::init();
Venu_Shop_Leads::init();

add_action(
	'plugins_loaded',
	function () {
		if ( ! class_exists( 'WooCommerce' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><strong>Venu Shop</strong> needs WooCommerce. Install and activate WooCommerce, then come back to Venu Shop.</p></div>';
				}
			);
			return;
		}
		Venu_Shop_Catalog::init();
		Venu_Shop_Checkout::init();
	}
);
