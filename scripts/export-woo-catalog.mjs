/**
 * Publishes the bike catalogue for the WooCommerce store (shop.venumotors.in).
 *
 * bikes.js stays the only place prices, colours and battery packs are written.
 * This script reads it and writes the same facts as JSON to:
 *
 *   public/shop-catalog.json                  → deployed with the site; the store's
 *                                               "Sync from website" button reads it
 *   woocommerce/venu-shop/catalog.json        → the plugin's built-in fallback copy
 *
 * It runs before every `npm run build`, so a price change goes live in two steps:
 * upload the new build, then press Venu Shop › Sync from website in WordPress.
 *
 *   npm run catalog:woo        (on its own)
 *
 * Ids here must match the ones the Buy now link sends (see src/lib/shop.js) —
 * both come from `slugify`, which is why this imports it rather than repeating it.
 */
import { writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { BIKES, packLabel, packId, slugify } from "../src/pages/explore/bikes.js"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SITE_URL = (process.env.VITE_SITE_URL || "https://venumotors.in").replace(/\/$/, "")

const absolute = (path) => (path ? new URL(encodeURI(path), `${SITE_URL}/`).href : "")

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])

/** Spec list for the product description — what shows in WooCommerce admin. */
function description(bike) {
  const rows = (Array.isArray(bike.keyFeatures) ? bike.keyFeatures : []).filter((row) => row?.label && row?.value)
  const list = rows.length
    ? `<ul>${rows.map((row) => `<li><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value)}</li>`).join("")}</ul>`
    : ""
  return `${list}<p>${escapeHtml(bike.specNote ?? "")}</p><p><a href="${SITE_URL}/${bike.slug}">${escapeHtml(bike.name)} on venumotors.in</a></p>`
}

// Only models with published prices can be bought; the rest stay enquiry-only.
const models = Object.values(BIKES)
  .filter((bike) => bike.packs?.length && bike.colours?.length)
  .map((bike) => ({
    slug: bike.slug,
    name: bike.name,
    tagline: bike.tagline,
    description: description(bike),
    image: absolute(bike.variants?.[0]?.image ?? bike.image),
    colours: bike.colours.map((colour) => ({ id: slugify(colour.name), name: colour.name })),
    packs: bike.packs.map((pack) => ({ id: packId(pack), label: packLabel(pack), price: pack.price })),
  }))

const catalog = {
  generated: new Date().toISOString(),
  site: SITE_URL,
  currency: "INR",
  models,
}

const json = `${JSON.stringify(catalog, null, 2)}\n`
for (const target of ["public/shop-catalog.json", "woocommerce/venu-shop/catalog.json"]) {
  const file = resolve(root, target)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, json)
}

const options = models.reduce((n, m) => n + m.colours.length * m.packs.length, 0)
console.log(`shop catalogue: ${models.length} models, ${options} colour × battery options → public/shop-catalog.json`)
