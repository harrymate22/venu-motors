# Venu Motors × WooCommerce

The website (venumotors.in) stays the React app it is. A separate WordPress + WooCommerce store on **shop.venumotors.in** takes the payments. The two talk through the **Venu Shop** plugin in this folder.

```
venumotors.in                                    shop.venumotors.in
─────────────                                    ──────────────────
/thunder/book  → pick colour, battery, city
  "Buy now" (₹45,000)  ───────────────────────▶  cart = exactly that scooter at its price
                                                 → one-page checkout → Razorpay
/order-confirmed  ◀───────────────────────────  after payment
Home offers form, dealership form  ───────────▶  Venu Shop › Leads  (+ email to you)
/shop-catalog.json  ──────────────────────────▶  "Sync from website" builds the products
```

**Prices live in one place:** `src/pages/explore/bikes.js`. Every build writes them to `public/shop-catalog.json`, and the store copies them from there when you press **Sync from website**. You never type a price into WooCommerce.

---

## One-time setup (about an hour)

### 1. Create the store on Hostinger

1. hPanel → **Domains → Subdomains** → create `shop` on venumotors.in.
2. hPanel → **Websites → Auto Installer → WordPress** → install on `shop.venumotors.in`. Note the admin login.
3. hPanel → **Security → SSL** → make sure shop.venumotors.in has SSL (https). Razorpay won't work without it.

### 2. Install the plugins

In the shop's WordPress admin → **Plugins → Add New**:

1. **WooCommerce**. Install and activate it, then skip the setup wizard or answer: India, INR, "I sell physical products".
2. **Razorpay for WooCommerce** (by Razorpay). Install and activate.
3. **Venu Shop**. Click **Upload Plugin**, choose `venu-shop.zip` from this folder, then activate.

### 3. WooCommerce settings

WooCommerce → **Settings**:

- **Site visibility**: **Live**. New WooCommerce stores start in *Coming soon* mode, which shows buyers a "launching soon" page instead of checkout.
- **General**: Store address = your Vizag address · Selling location = India · Currency = Indian rupee (₹) · Decimals = 0.
- **Tax**: leave off unless your accountant says to charge GST at checkout. The website prices are charged exactly as shown.
- **Accounts & Privacy**: tick **Allow customers to place orders without an account** (guest checkout).
- **Emails**: set the "From" name to *Venu Motors*, and the new-order recipient to whoever handles orders.
- **Payments**: enable **Razorpay**, then disable every other method (Cash on delivery, Bank transfer, Cheque).

### 4. Razorpay

1. In the Razorpay dashboard, switch to **Test mode**, go to **Account & Settings → API Keys**, and generate a key.
2. WooCommerce → Settings → Payments → **Razorpay** → paste the **Key ID** and **Key Secret**, then save.
3. Set up the webhook exactly as the Razorpay plugin's settings screen describes. It shows the webhook URL to paste into Razorpay. With the webhook set, orders are marked paid even if the buyer closes the tab right after paying.

### 5. Tidy the checkout page

Pages → **Checkout** → Edit. Click the checkout block, and in the right-hand panel:

- **Phone number**: Required (the dealership needs to call the buyer).
- **Company**: Hidden.
- **Order notes**: off, unless you want them.

Appearance: any clean theme works (the default *Twenty Twenty-Five* is fine). Under **Appearance → Editor → Site identity**, set the site title to *Venu Motors* and upload the logo (`public/icons/vm_logo.png`).

### 6. Venu Shop settings

WordPress admin → **Venu Shop**:

| Setting | Value |
|---|---|
| Main website | `https://venumotors.in` |
| Send new leads to | the email(s) that should get enquiries, comma-separated |
| Catalogue address | leave empty |
| Shop pages | ticked. The store is checkout-only, and anything else goes back to the website. |
| After payment | ticked. Buyers see the confirmation on venumotors.in. |

Click **Save**, then **Sync from the plugin's built-in copy**. You should see something like *"5 models (5 new), 27 colour × battery options (27 new…)"*. Products → All products now lists Venu Thunder, Icon, E-Fly, E-Fighter and Spot.

### 7. Point the website at the store and deploy

The website reads the store address from `VITE_SHOP_URL`. The default is already `https://shop.venumotors.in`, so there's nothing to change unless the store moves.

```bash
npm run build          # also writes public/shop-catalog.json
```

Upload **everything** in `dist/` to venumotors.in's `public_html`, including the hidden `.htaccess` file. `.htaccess` makes links like `venumotors.in/order-confirmed` open the app instead of a 404.

### 8. Test with Razorpay test mode

1. Open venumotors.in/thunder → **Buy Now** → pick a colour (and a battery on Spot / E-Fighter) → **Buy now**.
2. You land on shop.venumotors.in checkout with that scooter at its price. Fill it in and pay with a [Razorpay test card](https://razorpay.com/docs/payments/payments/test-card-details/).
3. You're sent to venumotors.in/order-confirmed with the order number.
4. In WordPress: **WooCommerce → Orders** shows the order (status *Processing*) with colour, battery and **Delivery city**. You and the buyer both get an email.
5. Send the home-page offers form and the dealership form, then check **Venu Shop → Leads** and your inbox.

When all of that works, switch Razorpay to **Live mode**, paste the live keys in WooCommerce, and you're selling.

---

## Day to day

- **New order**: WooCommerce emails you. Open it under WooCommerce → Orders. It shows model, colour, battery and delivery city. When the scooter is handed over, mark the order **Completed** (the buyer gets an email).
- **Refund**: open the order → **Refund** → amount → *Refund via Razorpay*.
- **Leads**: Venu Shop → **Leads**. Filter by form and **Download CSV** for calling lists. Each lead is also emailed to you.
- **Price / colour / battery change**: edit `bikes.js` → `npm run build` → upload `dist/` → WordPress → Venu Shop → **Sync from website**. Colours or batteries you removed become unbuyable, and nothing is deleted.
- **Out of stock**: Products → the model → Variations → tick *Manage stock* or set *Out of stock* on that colour/battery. The website's Buy now then returns the buyer to the model page with a "not available online" note.

## Good to know

- **Don't edit the SKUs** (`VENU-THUNDER-BLUE-60V-32AH` …). The Buy now link finds the scooter by SKU.
- Prices are overwritten on every sync, so change them in `bikes.js`, not in WooCommerce.
- Products are set as **virtual** (no shipping step), because the dealership in the buyer's city hands the scooter over. If you later ship, untick *Virtual* on the variations and add a shipping zone. The sync won't undo that.
- The product photo is imported from the website on the first sync. If it fails (for example, the website isn't live yet), set it by hand under Products. Buying still works either way.
- Leads are limited to 5 per visitor per 10 minutes, bots are caught by a hidden field, and a double-tap doesn't create a second lead.
- A tracking plugin that fires on WooCommerce's thank-you page won't see buyers, because they go straight to the website. Either untick **After payment** in Venu Shop, or fire the pixel on the website. The confirmation page already sends a Meta Pixel `Purchase` event when the pixel is installed on venumotors.in.

## Files

```
woocommerce/
  README.md              this guide
  venu-shop.zip          upload this in WordPress → Plugins → Add New → Upload
  venu-shop/             the plugin's source (the zip is built from this)
    venu-shop.php
    catalog.json         built-in copy of the catalogue (written by npm run build)
    includes/
      class-venu-shop-settings.php   admin screen, settings
      class-venu-shop-catalog.php    bikes.js → WooCommerce products
      class-venu-shop-checkout.php   Buy now link, one-page checkout, redirects
      class-venu-shop-leads.php      form endpoint, Leads screen, CSV, emails
scripts/export-woo-catalog.mjs       writes shop-catalog.json from bikes.js
src/lib/shop.js                      Buy now links + lead form submissions
```
