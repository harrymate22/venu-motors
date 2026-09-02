import { BIKES } from "@/pages/explore/bikes"

/**
 * Portfolio models shown in the "Meet the Venu …" home section.
 *
 * The section renders one model group at a time; the header toggle swaps between
 * them (Thunder / Icon / E-Fly / E-Fighter / Spot) and the heading follows the
 * active group.
 *
 * NOTHING about a model is repeated here. Which finishes exist, what they're
 * called, their accent colour, their photography, the price, the range and the
 * charging time all come off the catalogue entry in bikes.js, so the product
 * catalogue and the sales price list are each applied in exactly one place.
 * What lives here is card-only copy: the one-line tagline per finish.
 *
 * Cards are built from a model's `variants`, which is the set of finishes that
 * have their own studio shot — so a card can never show one colour's paint under
 * another colour's label. A catalogue finish we haven't shot yet still appears
 * in the configurator on the model page; it just doesn't get a card here.
 *
 * @typedef {Object} Product
 * @property {string}    id
 * @property {string}    model       e.g. "Venu Thunder"
 * @property {string}    slug        Explore route, e.g. "thunder" → /thunder
 * @property {string}    ctaLabel    Primary CTA text
 * @property {string}    secondaryLabel
 * @property {string}    variant     Catalogue colour name, shown as the accent label
 * @property {string}    tagline
 * @property {string}   [price]      On-road price, e.g. "₹45,000"
 * @property {string}   [priceLabel] Shown when `price` is unknown
 * @property {string[]}  specs       Short spec chips
 * @property {string}    accent      Hex accent for the variant label
 * @property {string}    image
 *
 * @typedef {Object} Model
 * @property {string}    id
 * @property {string}    label     Toggle label, e.g. "Thunder"
 * @property {string}    heading   Section heading for this group
 * @property {Product[]} products
 */

/**
 * Builds one card per photographed finish of a model.
 *
 * `taglines` is keyed by the catalogue colour name exactly as bikes.js spells it
 * ("Gray / Silver", "Red / Mehrun", …). A finish with no entry here falls back
 * to the model's own tagline rather than rendering an empty line, so adding
 * photography for a new colour can never ship a blank card.
 *
 * @param {{ modelId: string, taglines: Record<string, string> }} config
 * @returns {Product[]}
 */
function colourCards({ modelId, taglines }) {
  const bike = BIKES[modelId]

  return bike.variants.map((variant) => ({
    id: variant.id,
    model: bike.name,
    slug: bike.slug,
    variant: variant.colour,
    accent: variant.accent,
    tagline: taglines[variant.colour] ?? bike.tagline,
    image: variant.image,
    ctaLabel: `Explore ${bike.shortName}`,
    ...(bike.price
      ? { price: bike.price, secondaryLabel: "Buy Now" }
      : // No price on this model yet, so the second action stays an enquiry.
        { priceLabel: bike.priceLabel, secondaryLabel: "Book a test ride" }),
    specs: [`${bike.rangeText} range`, `${bike.chargeTime} full charge`],
  }))
}

/** Thunder — Black and Green wait on their studio shots. */
const THUNDER_PRODUCTS = colourCards({
  modelId: "thunder",
  taglines: {
    "Red / Mehrun": "Bold looks, effortless everyday ride",
    Blue: "Built for Indian roads",
    "Gray / Silver": "Understated finish, ready every day",
  },
})

/** Icon — Cherry Red waits on its studio shot. */
const ICON_PRODUCTS = colourCards({
  modelId: "icon",
  taglines: {
    "Aqua Green": "Ride green, 80 km at a time",
    "Mat Blue": "Keyless, cruise-ready, effortless",
  },
})

/** E-Fly — every catalogue finish is photographed. */
const EFLY_PRODUCTS = colourCards({
  modelId: "efly",
  taglines: {
    "Aqua Green": "Charge at home, ride green daily",
    "Mat Blue": "Electric mobility, keyless and cruise-ready",
    "Cherry Red": "Bold looks, zero emissions",
  },
})

/**
 * E-Fighter — sold with a choice of chemistry (graphene ₹65,000 or lithium-ion
 * ₹82,000), so the card quotes the graphene price and the graphene charging
 * time. Taglines stay off both, since a card can't say which pack you'd pick.
 *
 * PENDING PHOTOGRAPHY: the three `efighter` shots these cards point at don't
 * exist under /public/Home-page yet (see the note on the entry in bikes.js), so
 * this group renders with missing images until they land.
 */
const EFIGHTER_PRODUCTS = colourCards({
  modelId: "efighter",
  taglines: {
    Grey: "Understated finish, disc brakes at both ends",
    "Cherry Red": "Disc brakes front and rear, bold as they come",
    Black: "Two battery options, one sharp silhouette",
  },
})

/**
 * Spot — sport-bodied model and the most affordable in the range. It's sold in
 * two battery packs (48V and 60V); the card shows the 48V price with "onwards"
 * and the model page spells both out. Black waits on its studio shot.
 *
 * NOTE: /public/Home-page/White_Spot_Scooty.png is deliberately unused — the
 * catalogue lists Black rather than White for the Spot.
 */
const SPOT_PRODUCTS = colourCards({
  modelId: "spot",
  taglines: {
    "Red / Mehrun": "Sharp lines, zero emissions",
    Blue: "Reverse and cruise, built for the city",
    Green: "Charge at home, ride green",
    "Gray / Silver": "Street-ready, made for Indian roads",
  },
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
    id: "efighter",
    label: "E-Fighter",
    heading: "Meet the Venu E-Fighter",
    products: EFIGHTER_PRODUCTS,
  },
  {
    id: "spot",
    label: "Spot",
    heading: "Meet the Venu Spot",
    products: SPOT_PRODUCTS,
  },
]
