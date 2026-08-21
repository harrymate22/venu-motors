import { BIKES, CHARGE_TIME } from "@/pages/explore/bikes"

/**
 * Portfolio models shown in the "Meet the Venu …" home section.
 *
 * The section renders one model group at a time; the header toggle swaps between
 * them (Thunder / Icon / E-Fly / Wenu / Spot) and the heading follows the
 * active group.
 *
 * Price, range and charging time are NOT repeated here — every card reads them
 * off the catalogue entry in bikes.js, so the team's price list only has to be
 * applied in one place. What lives here is card-only copy: which finishes get a
 * card, their taglines, and which shot each one uses.
 *
 * @typedef {Object} Product
 * @property {string}    id
 * @property {string}    model       e.g. "Venu Thunder"
 * @property {string}   [slug]       Explore route, e.g. "thunder" → /thunder
 * @property {string}   [href]       Plain link, used when there's no bike page yet
 * @property {string}   [ctaLabel]   Primary CTA text (default: "Explore <model>")
 * @property {string}   [secondaryLabel] Secondary CTA text (default: "Buy Now")
 * @property {string}    variant     Colour name shown as the accent label
 * @property {string}    tagline
 * @property {string}   [price]      On-road price, e.g. "₹45,000"
 * @property {string}   [priceLabel] Shown when `price` is unknown
 * @property {string[]}  specs       Short spec chips
 * @property {string}    accent      Hex accent for the variant label
 * @property {string}    image
 *
 * @typedef {Object} Colour
 * @property {string}  id
 * @property {string}  name
 * @property {string}  tagline
 * @property {string} [image]  Falls back to the model's `fallbackImage`
 *
 * @typedef {Object} Model
 * @property {string}    id
 * @property {string}    label     Toggle label, e.g. "Thunder"
 * @property {string}    heading   Section heading for this group
 * @property {Product[]} products
 */

/**
 * Label colours for the shared five-finish palette — the colour of the variant
 * name, not the paint. White uses a readable slate so it doesn't disappear
 * against the white card.
 */
const ACCENTS = {
  red: "#E11D48",
  grey: "#6B7280",
  blue: "#2563EB",
  green: "#16A34A",
  white: "#64748B",
}

/**
 * Builds one card per finish. Specs are shared across a model's colours, so the
 * price/range/charge chips all come from `BIKES[modelId]`; only the paint, the
 * tagline and the shot change per card.
 *
 * Colours without their own shot fall back to `fallbackImage`, so a card can
 * show a mismatched paint colour until real photography lands.
 *
 * `shortName` is the name used in the CTA; it defaults to the model without the
 * "Venu " prefix, which is too long for a button on some models.
 *
 * @param {{ modelId: string, model: string, shortName?: string, colours: Colour[], fallbackImage: string }} config
 * @returns {Product[]}
 */
function colourCards({ modelId, model, shortName, colours, fallbackImage }) {
  const ctaName = shortName ?? model.replace(/^Venu\s/, "")
  const bike = BIKES[modelId]

  return colours.map(({ id, name, tagline, image }) => ({
    id: `${modelId}-${id}`,
    model,
    // Every model now has its own page; `modelId` doubles as the route slug.
    slug: modelId,
    variant: name,
    accent: ACCENTS[id],
    tagline,
    image: image ?? fallbackImage,
    ctaLabel: `Explore ${ctaName}`,
    ...(bike.price
      ? { price: bike.price, secondaryLabel: "Buy Now" }
      : // No price on this model yet, so the second action stays an enquiry.
        { priceLabel: bike.priceLabel, secondaryLabel: "Book a test ride" }),
    specs: [
      bike.rangeKm ? `${bike.rangeKm} km range` : `${bike.battery} battery`,
      `${CHARGE_TIME} full charge`,
    ],
  }))
}

/** Thunder — Green and White cards wait on their studio shots. */
const THUNDER_PRODUCTS = colourCards({
  modelId: "thunder",
  model: "Venu Thunder",
  fallbackImage: "/Home-page/red_thunder_scooty.png",
  colours: [
    {
      id: "red",
      name: "Red",
      tagline: "Bold looks, effortless everyday ride",
      image: "/Home-page/red_thunder_scooty.png",
    },
    {
      id: "blue",
      name: "Blue",
      tagline: "Built for Indian roads",
      image: "/Home-page/blue_thunder_scooty.png",
    },
    {
      id: "grey",
      name: "Grey",
      tagline: "Ride green, every single day",
      image: "/Home-page/grey_thunder_scooty.png",
    },
  ],
})

/** Icon — every finish has its own shot except Red, which falls back to cyan. */
const ICON_PRODUCTS = colourCards({
  modelId: "icon",
  model: "Venu Icon",
  fallbackImage: "/Home-page/icon_scooty.png",
  colours: [
    { id: "red", name: "Red", tagline: "Bold statement, zero emissions" },
    {
      id: "grey",
      name: "Grey",
      tagline: "Understated looks, built for Indian roads",
      image: "/Home-page/icon_grey_scooty.png",
    },
    {
      id: "blue",
      name: "Blue",
      tagline: "Keyless, cruise-ready, effortless",
      image: "/Home-page/icon_blue_scooty.png",
    },
    {
      id: "green",
      name: "Green",
      tagline: "Ride green, 80 km at a time",
      image: "/Home-page/icon_green_scooty.png",
    },
    {
      id: "white",
      name: "White",
      tagline: "Clean lines, everyday comfort",
      image: "/Home-page/icon_white_scooty.png",
    },
  ],
})

/** E-Fly — only White still falls back to the Blue shot. */
const EFLY_PRODUCTS = colourCards({
  modelId: "efly",
  model: "Venu E-Fly",
  fallbackImage: "/Home-page/blue_efly_scooty.png",
  colours: [
    {
      id: "red",
      name: "Red",
      tagline: "Bold looks, zero emissions",
      image: "/Home-page/red_efly_scooty.png",
    },
    {
      id: "grey",
      name: "Grey",
      tagline: "Understated and made for Indian roads",
      image: "/Home-page/grey_efly_scooty.png",
    },
    {
      id: "blue",
      name: "Blue",
      tagline: "Electric mobility, keyless and cruise-ready",
      image: "/Home-page/blue_efly_scooty.png",
    },
    {
      id: "green",
      name: "Green",
      tagline: "Charge at home, ride green daily",
      image: "/Home-page/green_efly_scooty.png",
    },
    { id: "white", name: "White", tagline: "Clean lines, three speed modes" },
  ],
})

/**
 * Wenu eBike — retro-bodied model, and the one the team's price list doesn't
 * cover yet, so its cards show "Price on request". All five finishes have their
 * own shot, so `fallbackImage` is unused here for now.
 *
 * NOTE: /public/WENU_RED.jpeg and /public/WENU_SILVERY.jpeg exist but are a
 * different treatment (flat background, dual view, ultra-wide), so they'd crop
 * badly and clash with the studio shots. Left unused deliberately.
 */
const WENU_PRODUCTS = colourCards({
  modelId: "wenu",
  model: "Wenu eBike",
  shortName: "Wenu",
  fallbackImage: "/Home-page/blue_wenu_scooty.png",
  colours: [
    {
      id: "red",
      name: "Red",
      tagline: "Retro looks, zero emissions",
      image: "/Home-page/red_wenu_scooty.png",
    },
    {
      id: "grey",
      name: "Grey",
      tagline: "Timeless grey, made for Indian roads",
      image: "/Home-page/grey_wenu_scooty.png",
    },
    {
      id: "blue",
      name: "Blue",
      tagline: "Classic styling, electric heart",
      image: "/Home-page/blue_wenu_scooty.png",
    },
    {
      id: "green",
      name: "Green",
      tagline: "Ride green with retro charm",
      image: "/Home-page/green_wenu_scooty.png",
    },
    {
      id: "white",
      name: "White",
      tagline: "Clean classic lines, keyless entry",
      image: "/Home-page/white_wenu_scooty.png",
    },
  ],
})

/**
 * Spot — sport-bodied model and the most affordable in the range. It's sold in
 * two battery packs (48V and 60V); the card shows the 48V price with "onwards"
 * and the model page spells both out. All five finishes have their own shot, so
 * `fallbackImage` is unused here for now.
 *
 * NOTE: the file is `White_Spot_Scooty.png` (mixed case) while every other
 * asset here is lowercase. Referenced verbatim so it resolves on a
 * case-sensitive host; worth renaming to `white_spot_scooty.png` for consistency.
 */
const SPOT_PRODUCTS = colourCards({
  modelId: "spot",
  model: "Venu Spot",
  fallbackImage: "/Home-page/White_Spot_Scooty.png",
  colours: [
    {
      id: "red",
      name: "Red",
      tagline: "Sharp lines, zero emissions",
      image: "/Home-page/red_spot_scooty.png",
    },
    {
      id: "grey",
      name: "Grey",
      tagline: "Street-ready, made for Indian roads",
      image: "/Home-page/grey_spot_scooty.png",
    },
    {
      id: "blue",
      name: "Blue",
      // Filename has colour/model reversed vs the others; referenced verbatim.
      tagline: "Reverse and cruise, built for the city",
      image: "/Home-page/spot_blue_scooty.png",
    },
    {
      id: "green",
      name: "Green",
      tagline: "Charge at home, ride green",
      image: "/Home-page/green_spot_scooty.png",
    },
    {
      id: "white",
      name: "White",
      tagline: "Bold LED styling, keyless entry",
      image: "/Home-page/White_Spot_Scooty.png",
    },
  ],
})

/** @type {Model[]} */
export const MODELS = [
  {
    id: "thunder",
    label: "Thunder",
    heading: "Meet the Venu Thunder",
    products: THUNDER_PRODUCTS,
  },
  {
    id: "icon",
    label: "Icon",
    heading: "Meet the Venu Icon",
    products: ICON_PRODUCTS,
  },
  {
    id: "efly",
    label: "E-Fly",
    heading: "Meet the Venu E-Fly",
    products: EFLY_PRODUCTS,
  },
  {
    id: "wenu",
    label: "Wenu",
    heading: "Meet the Wenu eBike",
    products: WENU_PRODUCTS,
  },
  {
    id: "spot",
    label: "Spot",
    heading: "Meet the Venu Spot",
    products: SPOT_PRODUCTS,
  },
]
