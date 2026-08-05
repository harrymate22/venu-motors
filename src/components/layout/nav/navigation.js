/**
 * Navigation model — kept to the pages this site actually has, rather than a
 * large sitemap of stubs.
 *
 * `E_SCOOTERS` mirrors the five models in the home portfolio section. Each one
 * now has its own page (see src/pages/explore/bikes.js) and its own studio shot,
 * so the menu no longer shows five identical red Thunders.
 */

/** @type {{ id: string, name: string, href: string, image: string }[]} */
export const E_SCOOTERS = [
  { id: "thunder", name: "Thunder", href: "/thunder", image: "/Home-page/red_thunder_scooty.png" },
  { id: "icon", name: "Icon", href: "/icon", image: "/Home-page/icon_scooty.png" },
  { id: "efly", name: "E-Fly", href: "/efly", image: "/Home-page/blue_efly_scooty.png" },
  { id: "wenu", name: "Wenu", href: "/wenu", image: "/Home-page/blue_wenu_scooty.png" },
  { id: "spot", name: "Spot", href: "/spot", image: "/Home-page/spot_blue_scooty.png" },
]

/** Top-level pages — each one resolves to a real route or home section. */
export const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Latest News", href: "/#news" },
  { label: "Happy Stories", href: "/#stories" },
  { label: "Contact Us", href: "/#enquire" },
]

export const PHONE = "+91 91339 13975"
export const PHONE_HREF = "tel:+919133913975"
