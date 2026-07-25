/**
 * Navigation model — kept to the pages this site actually has, rather than a
 * large sitemap of stubs.
 *
 * `E_SCOOTERS` mirrors the five models in the home portfolio section. Only
 * Thunder has its own page today; the rest deep-link to the portfolio carousel,
 * which pre-selects the model from the URL hash (see Portfolio.jsx).
 *
 * NOTE: every bike shares `thunder_purchase_bg.png` as a placeholder thumbnail.
 * Give each entry its own cut-out shot when they're ready — the grid reads as
 * five identical red Thunders until then.
 */

const PLACEHOLDER_THUMB = "/explore-pages/thunder_purchase_bg.png"

/** @type {{ id: string, name: string, href: string, image: string }[]} */
export const E_SCOOTERS = [
  { id: "thunder", name: "Thunder", href: "/thunder", image: PLACEHOLDER_THUMB },
  { id: "icon", name: "Icon", href: "/#icon", image: PLACEHOLDER_THUMB },
  { id: "efly", name: "E-Fly", href: "/#efly", image: PLACEHOLDER_THUMB },
  { id: "wenu", name: "Wenu", href: "/#wenu", image: PLACEHOLDER_THUMB },
  { id: "spot", name: "Spot", href: "/#spot", image: PLACEHOLDER_THUMB },
]

/** Top-level pages — each one resolves to a real route or home section. */
export const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Latest News", href: "/#news" },
  { label: "Happy Stories", href: "/#stories" },
  { label: "Contact Us", href: "/#enquire" },
]

export const PHONE = "+91 91339 13975"
export const PHONE_HREF = "tel:+919133913975"
