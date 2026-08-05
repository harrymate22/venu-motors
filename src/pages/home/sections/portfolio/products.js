/**
 * Portfolio models shown in the "Meet the Venu …" home section.
 *
 * The section renders one model group at a time; the header toggle swaps between
 * them (Thunder / Icon / E-Fly / Wenu / Spot) and the heading follows the
 * active group.
 *
 * Thunder data sourced from venumotors.com/thunder (₹53,000 on-road, 65–70 km
 * range, 8 hr charge, colours Red / Blue / Grey), each with its own product shot.
 *
 * Icon, E-Fly, Wenu and Spot come from their spec sheets, which all carry
 * identical figures — 100 km / charge, 9–10 hr charge, graphene battery, 80 kg,
 * and the same five finishes. None of those sheets lists a price, so their cards
 * show `priceLabel` instead of a figure. All four are built by `colourCards`.
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
 * @property {string}   [price]      On-road price, e.g. "₹53,000"
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
 * Builds one card per finish for a model whose specs are shared across colours.
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
    // No published price on these sheets, so the second action stays an enquiry.
    secondaryLabel: "Book a test ride",
    priceLabel: "Price on request",
    specs: ["Up to 100 km range", "9–10 hr full charge"],
  }))
}

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
      tagline: "Ride green, 100 km at a time",
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
 * Wenu eBike — retro-bodied model. All five finishes have their own shot, so
 * `fallbackImage` is unused here for now.
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
 * Spot — sport-bodied model. All five finishes have their own shot, so
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
    products: [
      {
        id: "thunder-red",
        model: "Venu Thunder",
        slug: "thunder",
        variant: "Red",
        tagline: "Bold looks, effortless everyday ride",
        price: "₹53,000",
        specs: ["65–70 km range", "8 hr full charge"],
        accent: "#E11D48",
        image: "/Home-page/red_thunder_scooty.png",
      },
      {
        id: "thunder-blue",
        model: "Venu Thunder",
        slug: "thunder",
        variant: "Blue",
        tagline: "Built for Indian roads",
        price: "₹53,000",
        specs: ["65–70 km range", "8 hr full charge"],
        accent: "#2563EB",
        image: "/Home-page/blue_thunder_scooty.png",
      },
      {
        id: "thunder-grey",
        model: "Venu Thunder",
        slug: "thunder",
        variant: "Grey",
        tagline: "Ride green, every single day",
        price: "₹53,000",
        specs: ["65–70 km range", "8 hr full charge"],
        accent: "#6B7280",
        image: "/Home-page/grey_thunder_scooty.png",
      },
    ],
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
