import { packId, slugify } from "@/pages/explore/bikes"

/**
 * The WooCommerce store on shop.venumotors.in — it takes the payments and keeps
 * the leads. Setup and the full picture: woocommerce/README.md.
 *
 * Point a local build at another store with VITE_SHOP_URL in .env.local.
 */
export const SHOP_URL = (import.meta.env.VITE_SHOP_URL || "https://shop.venumotors.in").replace(/\/+$/, "")

/**
 * Link for the Buy now button: the store swaps its cart for exactly this
 * scooter — model, colour and battery at that pack's price — and opens its
 * one-page checkout. The ids must match the SKUs the store builds from
 * shop-catalog.json, which is why both come from the same helpers in bikes.js.
 *
 * @param {{ slug: string, colour: string, pack: object, city?: string }} choice
 */
export function buyNowUrl({ slug, colour, pack, city }) {
  const params = new URLSearchParams({ venu_buy: slug, colour: slugify(colour), battery: packId(pack) })
  if (city) params.set("city", city)
  return `${SHOP_URL}/?${params}`
}

/**
 * Sends a website form to the store's Leads screen (and the team's inbox).
 * Resolves on success; rejects with an Error whose message is safe to show.
 *
 * @param {"offers" | "test-ride" | "dealership"} form
 * @param {Record<string, string>} fields  name and phone are required
 * @param {string} [honeypot]  value of the hidden company_website input — empty for people
 */
export async function submitLead(form, fields, honeypot = "") {
  let response
  try {
    response = await fetch(`${SHOP_URL}/wp-json/venu/v1/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, fields, company_website: honeypot }),
    })
  } catch {
    throw new Error("We couldn't reach our server. Check your connection and try again.")
  }
  if (response.ok) return

  const data = await response.json().catch(() => null)
  throw new Error(data?.message || "Something went wrong. Please try again, or call us.")
}

/** Hidden field bots fill in and people never see — spread onto an <input>. */
export const honeypotProps = {
  type: "text",
  name: "company_website",
  tabIndex: -1,
  autoComplete: "off",
  "aria-hidden": true,
  className: "hidden",
}
