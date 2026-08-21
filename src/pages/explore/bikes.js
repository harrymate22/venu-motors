/**
 * Bike catalogue — keyed by URL slug (e.g. /thunder).
 * Add a new bike here and it gets its own page automatically.
 *
 * PRICES AND RANGE come from the sales team's current list (Aug 2026), which
 * supersedes the older spec sheets:
 *
 *   Thunder  60V 32Ah              ₹45,000            60 km
 *   E-Fly    60V 42Ah              ₹59,000            80 km
 *   Icon     60V 42Ah              ₹60,000            80 km
 *   Spot     48V 32Ah / 60V 32Ah   ₹35,000 / ₹38,000  60 km
 *
 * Spot's range wasn't on that list; it shares Thunder's 60V 32Ah pack, so it
 * carries Thunder's 60 km. Wenu wasn't on the list at all — it stays on
 * `priceLabel` and, since the old 100 km sheet figure is no longer trusted
 * anywhere else in the range, quotes no range at all until its numbers land.
 *
 * @typedef {Object} Stat   { value, label }
 * @typedef {Object} SpecRow { label, value }
 */

/** ₹45,000 — Indian digit grouping. */
const inr = (value) => `₹${value.toLocaleString("en-IN")}`

/**
 * Indicative EMI at the finance terms advertised on the home page (6.99% p.a.
 * over 60 months — see EmiSection). Derived from the price rather than typed by
 * hand, so a price change can't leave a stale monthly figure behind.
 */
const EMI_RATE = 0.0699 / 12
const EMI_MONTHS = 60

function monthlyEmi(price) {
  const growth = (1 + EMI_RATE) ** EMI_MONTHS
  const emi = (price * EMI_RATE * growth) / (growth - 1)
  return `${inr(Math.round(emi / 10) * 10)}/mo`
}

/** Charging time is common to the whole range. */
export const CHARGE_TIME = "9–10 hrs"

/**
 * Battery packs are stored as volts + amp-hours rather than a display string,
 * so the label ("60V 32Ah") and the pack energy in kWh both derive from one
 * number each. The savings calculator uses `packKwh` to cost a full charge.
 *
 * @typedef {Object} Pack { volts, ah, price? }
 */
const packLabel = ({ volts, ah }) => `${volts}V ${ah}Ah`
export const packKwh = ({ volts, ah }) => (volts * ah) / 1000

/** Label colour for a variant name — the text, not the paint. */
const VARIANT_ACCENTS = {
  Red: "#E11D48",
  Grey: "#6B7280",
  Blue: "#2563EB",
  Green: "#16A34A",
  White: "#64748B",
}

/** The five finishes offered across the range. */
const FINISHES = [
  { name: "Red", hex: "#D42A2A" },
  { name: "Grey", hex: "#9AA0A6" },
  { name: "Blue", hex: "#2F5FE0" },
  { name: "Green", hex: "#3FA34D" },
  { name: "White", hex: "#FFFFFF" },
]

/**
 * Hero stats. Slot one is the range where we have one and the battery pack
 * where we don't, so the row never renders a hole (or a range we can't stand
 * behind) — see the Wenu note at the top.
 */
function heroStats({ rangeKm, battery }) {
  return [
    rangeKm
      ? { value: `${rangeKm} km`, label: "Range / charge" }
      : { value: battery, label: "Battery" },
    { value: CHARGE_TIME, label: "Charging time" },
    { value: "0", label: "Emissions" },
  ]
}

function highlightList(rangeKm) {
  return [
    "100% eco-friendly vehicle",
    "Charge at home",
    ...(rangeKm ? [`Up to ${rangeKm} km on a single charge`] : []),
    "Made for Indian conditions",
    "Graphene battery",
    `${CHARGE_TIME} charging time`,
  ]
}

function variantSpecs(rangeKm, battery) {
  return {
    columns: [
      rangeKm
        ? { value: `${rangeKm} km`, label: "Range / charge" }
        : { value: battery, label: "Battery" },
      { value: CHARGE_TIME, label: "Charging time" },
      { value: "80 kg", label: "Kerb weight" },
    ],
    bullets: ["Keyless entry & anti-theft", "Reverse & cruise mode"],
  }
}

const SHARED_KEY_FEATURES = [
  { label: "Keyless entry", value: "Yes" },
  { label: "Reverse", value: "Yes" },
  { label: "Cruise mode", value: "Yes" },
  { label: "Anti theft", value: "Yes" },
  { label: "Central lock", value: "Yes" },
  { label: "USB charging port", value: "Yes" },
  { label: "Charger", value: "Yes" },
  { label: "Registration", value: "Not required" },
  { label: "Driving licence", value: "Not required" },
  { label: "Speed mode", value: "1, 2 & 3" },
]

/**
 * Service copy is range-wide — doorstep pickup, insurance and warranty apply to
 * every model. The imagery is not: every photo under /explore-pages is a branded
 * red Thunder, so each page illustrates these cards with its own studio shots.
 * Swap in real service photography per model when it lands.
 */
function sharedService(pick) {
  return {
    heading: ["You ride.", "We take care of the rest."],
    subtitle:
      "Doorstep service, effortless insurance and a warranty that goes the distance — so every kilometre stays worry-free.",
    cards: [
      {
        image: pick(0),
        title: "Doorstep service",
        desc: "Pickup, service and drop — sorted right from your home. Faster, easier, hassle-free.",
        linkLabel: "Book a service",
        href: "#",
      },
      {
        image: pick(1),
        title: "Insurance, made simple",
        desc: "Comprehensive cover that's as smooth as your ride, sorted in minutes.",
        linkLabel: "Get insured",
        href: "#",
      },
      {
        image: pick(2),
        title: "Warranty that lasts",
        desc: "Extended cover up to 1.25 lakh km across battery and motor. Ride assured.",
        linkLabel: "Explore warranty plans",
        href: "#",
      },
    ],
  }
}

/**
 * The battery bento card. A single pack fits in the title; two (Spot) would
 * overflow it, so they drop to the subtitle.
 */
function batteryCard(battery, packs) {
  return packs?.length > 1
    ? { title: "Graphene battery", subtitle: `${battery} — pick your pack` }
    : { title: battery, subtitle: "Graphene — fast, durable and reliable" }
}

/**
 * Builds the three bento tabs. Slots 0/2/4 are the tall cards, and the photo
 * cards are drawn only from the model's own shots — Thunder's detail photos all
 * show a branded red Thunder, so reusing them here would put the wrong scooter
 * on the page. Everything else falls back to a tint.
 *
 * Performance slot 0 leads on range where we have one; without it (Wenu) the
 * battery leads instead and slot 2 picks up home charging.
 *
 * @param {{ pick: (i: number) => string, stylingNote: string, rangeKm?: number,
 *   battery: string, packs?: Pack[] }} config
 */
function sharedFeatureTabs({ pick, stylingNote, rangeKm, battery, packs }) {
  return [
    {
      id: "performance",
      label: "Performance",
      title: "Performance",
      subtitle: "Ready. Set. Ride.",
      cards: [
        rangeKm
          ? { icon: "Gauge", title: `Up to ${rangeKm} km`, subtitle: "Go the distance on a single charge", image: pick(0) }
          : { icon: "BatteryCharging", title: "Graphene battery", subtitle: "Fast, durable and reliable", image: pick(0) },
        { icon: "Zap", title: "3 ride modes", subtitle: "Speed modes 1, 2 & 3", tint: "rose" },
        rangeKm
          ? { icon: "BatteryCharging", ...batteryCard(battery, packs), image: pick(1) }
          : { icon: "PlugZap", title: "Charge at home", subtitle: "Any standard 5A socket", image: pick(1) },
        { icon: "Timer", title: `${CHARGE_TIME} charging`, subtitle: "Charge at home overnight", tint: "cream" },
        { icon: "Disc", title: "Disc + drum brakes", subtitle: "Confident stopping power", tint: "mint" },
        { icon: "RotateCcw", title: "Reverse mode", subtitle: "Effortless parking, every time", tint: "cream" },
      ],
    },
    {
      id: "design",
      label: "Design",
      title: "Design",
      subtitle: "Made to turn heads.",
      cards: [
        { icon: "Palette", title: "5 bold colours", subtitle: "Red, Grey, Blue, Green & White", image: pick(2) },
        { icon: "Lightbulb", title: "LED headlight", subtitle: "See and be seen", tint: "rose" },
        { icon: "Gauge", title: "Digital speedometer", subtitle: "Ride data at a glance", tint: "sky" },
        { icon: "CircleDot", title: "Tubeless tyres", subtitle: "Worry-free on rough roads", tint: "cream" },
        { icon: "Armchair", title: "Comfort seat", subtitle: "Ergonomic for long rides", image: pick(3) },
        { icon: "Sparkles", title: "Bold graphics", subtitle: stylingNote, tint: "cream" },
      ],
    },
    {
      id: "technology",
      label: "Technology",
      title: "Technology",
      subtitle: "Smarts that redefine your ride.",
      cards: [
        { icon: "KeyRound", title: "Keyless entry", subtitle: "Walk up and go", image: pick(4) },
        { icon: "ShieldCheck", title: "Anti-theft + central lock", subtitle: "Total peace of mind", tint: "rose" },
        { icon: "Usb", title: "USB charging port", subtitle: "Power your phone on the go", tint: "sky" },
        { icon: "Navigation", title: "Cruise mode", subtitle: "Effortless steady cruising", tint: "cream" },
        { icon: "FileCheck", title: "No registration or licence", subtitle: "Ride completely hassle-free", tint: "mint" },
        { icon: "PlugZap", title: "Portable charger", subtitle: "Charge anywhere, anytime", tint: "cream" },
      ],
    },
  ]
}

/**
 * One catalogue entry for a model that shares the range-wide feature set.
 *
 * PRICE-LESS (Wenu only, now): with no `price` the entry falls back to
 * `priceLabel`. BikeHero and BikeColours read that as "enquire" rather than
 * "buy", and BookingPage bounces /<slug>/book back to the model page — there's
 * nothing to configure a booking against. Add `price` and both flows light up
 * on their own, `booking` included.
 *
 * `packs` lists the battery/price combinations the model is sold in — one for
 * most models, two for Spot. The headline price is the cheapest pack, and where
 * there's more than one they're all spelled out in `specNote`, which the hero
 * prints under the stats. Omit `packs` entirely (Wenu) and the entry falls back
 * to `priceLabel`.
 *
 * `colours` deliberately lists only finishes with their own studio shot, so a
 * card never shows blue paint under a "Red" label. Those same shots are the only
 * photography these pages have, so they double as the booking-page stage image
 * (`bg`) and `pick()` cycles them for the bento and service cards.
 *
 * @param {{ slug: string, name: string, shortName?: string, tagline: string,
 *   packs?: Pack[], rangeKm?: number, image: string, showcaseImage: string,
 *   showcaseSubject: string, variants: { colour: string, image: string }[],
 *   stylingNote: string }} config
 */
function sharedSpecBike({
  slug,
  name,
  shortName,
  tagline,
  packs,
  rangeKm,
  image,
  showcaseImage,
  showcaseSubject,
  variants,
  stylingNote,
}) {
  const short = shortName ?? name.replace(/^Venu\s/, "")
  const shots = variants.map((v) => v.image)
  const pick = (i) => shots[i % shots.length]

  // Cheapest pack leads; the hero already frames `price` as "Starting at".
  const headline = packs && packs.reduce((a, b) => (b.price < a.price ? b : a))
  const battery = packs ? packs.map(packLabel).join(" / ") : "Graphene"
  // Two packs means two prices, so the note carries both; one pack just names it.
  const packNote =
    packs?.length > 1
      ? `${packs.map((p) => `${packLabel(p)} ${inr(p.price)}`).join(" · ")} · `
      : packs
        ? `${battery} · `
        : ""

  return {
    slug,
    name,
    shortName: short,
    eyebrow: "INTRODUCING",
    tagline,
    ...(headline ? { price: inr(headline.price) } : { priceLabel: "Price on request" }),
    image,

    battery,
    ...(packs ? { packs } : {}),
    ...(rangeKm ? { rangeKm } : {}),

    heroStats: heroStats({ rangeKm, battery }),
    specNote: `Specs of the ${name} · ${packNote}Graphene battery, built for Indian conditions.`,

    showcase: {
      title: `The all-new ${showcaseSubject}`,
      image: showcaseImage,
      features: [
        "Keyless entry & anti-theft",
        "Reverse & cruise mode",
        rangeKm ? `Up to ${rangeKm} km range` : "Graphene battery",
        "Available in 5 colours",
      ],
    },

    highlights: highlightList(rangeKm),
    // The studio shot doubles as the booking-page stage image for that finish.
    colours: variants.map(({ colour, image: shot }) => ({
      ...FINISHES.find((f) => f.name === colour),
      bg: shot,
    })),

    variants: variants.map(({ colour, image: shot }) => ({
      id: `${slug}-${colour.toLowerCase()}`,
      colour,
      accent: VARIANT_ACCENTS[colour],
      image: shot,
    })),
    variantSpecs: variantSpecs(rangeKm, battery),

    keyFeatures: SHARED_KEY_FEATURES,
    service: sharedService(pick),
    featureTabs: sharedFeatureTabs({ pick, stylingNote, rangeKm, battery, packs }),

    ...(headline
      ? {
          booking: {
            bookingAmount: "₹999",
            emi: monthlyEmi(headline.price),
            range: rangeKm ? `${rangeKm} km` : battery,
            benefitsNote: "No registration or licence needed — ride completely hassle-free.",
          },
        }
      : {}),

    // `specGroups` and `warranty` are Thunder-only for now — the mechanical
    // rows (suspension, brake, tyre size) aren't documented for these models.
  }
}

const THUNDER_PACK = { volts: 60, ah: 32, price: 45000 }
const THUNDER_BATTERY = packLabel(THUNDER_PACK)
const THUNDER_RANGE_KM = 60

export const BIKES = {
  thunder: {
    slug: "thunder",
    name: "Venu Thunder",
    shortName: "Thunder",
    eyebrow: "INTRODUCING",
    tagline: "Bold looks. Effortless range. Made for every Indian road.",
    price: inr(THUNDER_PACK.price),
    packs: [THUNDER_PACK],
    battery: THUNDER_BATTERY,
    rangeKm: THUNDER_RANGE_KM,
    image: "/explore-pages/thunder_bike.png",

    // Hero highlight stats
    heroStats: heroStats({ rangeKm: THUNDER_RANGE_KM, battery: THUNDER_BATTERY }),
    specNote: `Specs of the Venu Thunder · ${THUNDER_BATTERY} · Graphene battery, built for Indian conditions.`,

    // "Ride the future" showcase — poster image carries the bike + display text
    showcase: {
      title: "The all-new Venu Thunder X1",
      image: "/explore-pages/thunder_bike_x1.png",
      features: [
        "Keyless entry & anti-theft",
        "Reverse & cruise mode",
        `Up to ${THUNDER_RANGE_KM} km range`,
        "Available in 5 colours",
      ],
    },

    // Quick highlights (icon badges)
    highlights: highlightList(THUNDER_RANGE_KM),

    // `bg` = configurator stage image for that colour (falls back to Red's shot).
    colours: [
      { name: "Red", hex: "#D42A2A", bg: "/explore-pages/thunder_purchase_bg.png" },
      { name: "Grey", hex: "#9AA0A6" },
      { name: "Blue", hex: "#2F5FE0", bg: "/explore-pages/thunder_blue_bg.png" },
      { name: "Green", hex: "#3FA34D" },
      { name: "White", hex: "#FFFFFF" },
    ],

    // "Choose your Thunder" colour carousel — specs are shared, colour varies.
    // (Green + White cards will be added once their studio shots are ready.)
    variants: [
      { id: "red", colour: "Red", accent: "#E11D48", image: "/Home-page/red_thunder_scooty.png" },
      { id: "blue", colour: "Blue", accent: "#2563EB", image: "/Home-page/blue_thunder_scooty.png" },
      { id: "grey", colour: "Grey", accent: "#6B7280", image: "/Home-page/grey_thunder_scooty.png" },
    ],
    variantSpecs: variantSpecs(THUNDER_RANGE_KM, THUNDER_BATTERY),

    // +Features (mechanical)
    specGroups: [
      {
        title: "Battery & range",
        rows: [
          { label: "Battery", value: `${THUNDER_BATTERY} graphene` },
          { label: "Range per charge", value: `${THUNDER_RANGE_KM} km` },
          { label: "Charging time", value: CHARGE_TIME },
        ],
      },
      {
        title: "Suspension",
        rows: [
          { label: "Front", value: "Steel Hydraulic Cell Shocker" },
          { label: "Rear", value: "Steel Hydraulic Shocker" },
        ],
      },
      {
        title: "Brake system",
        rows: [
          { label: "Front", value: "Disc" },
          { label: "Rear", value: "Drum" },
        ],
      },
      {
        title: "Tyre",
        rows: [
          { label: "Front & Rear", value: "Tubeless" },
          { label: "Tyre number", value: "90-90-10" },
        ],
      },
      {
        title: "Body spec",
        rows: [
          { label: "Weight", value: "80 kg" },
          { label: "Head light", value: "LED" },
          { label: "Speedometer", value: "Digital" },
        ],
      },
    ],

    // Key features (yes/no table)
    keyFeatures: [
      { label: "Keyless entry", value: "Yes" },
      { label: "Reverse", value: "Yes" },
      { label: "Cruise mode", value: "Yes" },
      { label: "Anti theft", value: "Yes" },
      { label: "Portable battery", value: "No" },
      { label: "Central lock", value: "Yes" },
      { label: "USB charging port", value: "Yes" },
      { label: "Charger", value: "Yes" },
      { label: "Registration", value: "Not required" },
      { label: "Driving licence", value: "Not required" },
      { label: "Speed mode", value: "1, 2 & 3" },
    ],

    warranty: [
      { value: "0", label: "Emissions" },
      { value: "1 yr", label: "Motor warranty" },
      { value: "1 yr", label: "Battery warranty" },
    ],

    // Booking / configurator page (/thunder/book). Colours reuse `variants`.
    booking: {
      bookingAmount: "₹999",
      emi: monthlyEmi(THUNDER_PACK.price),
      range: `${THUNDER_RANGE_KM} km`,
      benefitsNote: "No registration or licence needed — ride completely hassle-free.",
    },

    // "Peace of mind" service section — heading + three image/link cards.
    // Swap the placeholder `image` paths for real service photos when ready.
    service: {
      heading: ["You ride.", "We take care of the rest."],
      subtitle:
        "Doorstep service, effortless insurance and a warranty that goes the distance — so every kilometre stays worry-free.",
      cards: [
        {
          image: "/explore-pages/thunder_disc.png",
          title: "Doorstep service",
          desc: "Pickup, service and drop — sorted right from your home. Faster, easier, hassle-free.",
          linkLabel: "Book a service",
          href: "#",
        },
        {
          image: "/explore-pages/scooter_insurance.png",
          title: "Insurance, made simple",
          desc: "Comprehensive cover that's as smooth as your ride, sorted in minutes.",
          linkLabel: "Get insured",
          href: "#",
        },
        {
          image: "/explore-pages/thunder_warranty.png",
          title: "Warranty that lasts",
          desc: "Extended cover up to 1.25 lakh km across battery and motor. Ride assured.",
          linkLabel: "Explore warranty plans",
          href: "#",
        },
      ],
    },

    // Sticky-tab bento section (Performance / Design / Technology).
    // `icon` is a lucide name resolved in BikeFeatures. Each tab has 6 cards laid
    // out in a fixed woven mosaic; cards 1/3/5 are the tall slots (give them an
    // `image` for a photo card, or a `tint`: cream | sky | mint | rose).
    featureTabs: [
      {
        id: "performance",
        label: "Performance",
        title: "Performance",
        subtitle: "Ready. Set. Ride.",
        cards: [
          { icon: "Gauge", title: `Up to ${THUNDER_RANGE_KM} km`, subtitle: "Go the distance on a single charge", image: "/explore-pages/thunder_performance_category.png" },
          { icon: "Zap", title: "3 ride modes", subtitle: "Speed modes 1, 2 & 3", tint: "rose" },
          { icon: "BatteryCharging", title: THUNDER_BATTERY, subtitle: "Graphene — fast, durable and reliable", image: "/explore-pages/thunder_battery.png" },
          { icon: "Timer", title: `${CHARGE_TIME} charging`, subtitle: "Charge at home overnight", tint: "cream" },
          { icon: "Disc", title: "Disc + drum brakes", subtitle: "Confident stopping power", image: "/explore-pages/thunder_disc.png" },
          { icon: "RotateCcw", title: "Reverse mode", subtitle: "Effortless parking, every time", tint: "cream" },
        ],
      },
      {
        id: "design",
        label: "Design",
        title: "Design",
        subtitle: "Made to turn heads.",
        cards: [
          { icon: "Palette", title: "5 bold colours", subtitle: "Red, Grey, Blue, Green & White", image: "/explore-pages/thunder_bike.png" },
          { icon: "Lightbulb", title: "LED headlight", subtitle: "See and be seen", tint: "rose" },
          { icon: "Gauge", title: "Digital speedometer", subtitle: "Ride data at a glance", tint: "sky" },
          { icon: "CircleDot", title: "Tubeless tyres", subtitle: "90-90-10, worry-free", tint: "cream" },
          { icon: "Armchair", title: "Comfort seat", subtitle: "Ergonomic for long rides", image: "/explore-pages/thunder_sit.png" },
          { icon: "Sparkles", title: "Bold graphics", subtitle: "Head-turning Thunder styling", tint: "cream" },
        ],
      },
      {
        id: "technology",
        label: "Technology",
        title: "Technology",
        subtitle: "Smarts that redefine your ride.",
        cards: [
          { icon: "KeyRound", title: "Keyless entry", subtitle: "Walk up and go", image: "/explore-pages/thunder_bike.png" },
          { icon: "ShieldCheck", title: "Anti-theft + central lock", subtitle: "Total peace of mind", tint: "rose" },
          { icon: "Usb", title: "USB charging port", subtitle: "Power your phone on the go", tint: "sky" },
          { icon: "Navigation", title: "Cruise mode", subtitle: "Effortless steady cruising", tint: "cream" },
          { icon: "FileCheck", title: "No registration or licence", subtitle: "Ride completely hassle-free", tint: "mint" },
          { icon: "PlugZap", title: "Portable charger", subtitle: "Charge anywhere, anytime", tint: "cream" },
        ],
      },
    ],
  },

  /** Icon — Red has no studio shot yet, so it's left out of the colour carousel. */
  icon: sharedSpecBike({
    slug: "icon",
    name: "Venu Icon",
    tagline: "Clean lines, calm ride. The everyday electric for Indian families.",
    packs: [{ volts: 60, ah: 42, price: 60000 }],
    rangeKm: 80,
    image: "/explore-pages/icon_bike.png",
    showcaseImage: "/Home-page/icon_blue_scooty.png",
    showcaseSubject: "Venu Icon",
    stylingNote: "Smooth, understated Icon styling",
    variants: [
      { colour: "Grey", image: "/Home-page/icon_grey_scooty.png" },
      { colour: "Blue", image: "/Home-page/icon_blue_scooty.png" },
      { colour: "Green", image: "/Home-page/icon_green_scooty.png" },
      { colour: "White", image: "/Home-page/icon_white_scooty.png" },
    ],
  }),

  /** E-Fly — White still awaits its studio shot. */
  efly: sharedSpecBike({
    slug: "efly",
    name: "Venu E-Fly",
    tagline: "Light on its feet. Built for the daily city run.",
    packs: [{ volts: 60, ah: 42, price: 59000 }],
    rangeKm: 80,
    image: "/explore-pages/efly_bike.png",
    showcaseImage: "/Home-page/red_efly_scooty.png",
    showcaseSubject: "Venu E-Fly",
    stylingNote: "Nimble, city-ready E-Fly styling",
    variants: [
      { colour: "Red", image: "/Home-page/red_efly_scooty.png" },
      { colour: "Grey", image: "/Home-page/grey_efly_scooty.png" },
      { colour: "Blue", image: "/Home-page/blue_efly_scooty.png" },
      { colour: "Green", image: "/Home-page/green_efly_scooty.png" },
    ],
  }),

  /** Wenu — the one model the team's price list doesn't cover yet. */
  wenu: sharedSpecBike({
    slug: "wenu",
    name: "Wenu eBike",
    shortName: "Wenu",
    tagline: "Classic looks, electric heart. Retro styling for modern streets.",
    image: "/explore-pages/wenu_bike.png",
    showcaseImage: "/Home-page/red_wenu_scooty.png",
    showcaseSubject: "Wenu eBike",
    stylingNote: "Timeless retro Wenu styling",
    variants: [
      { colour: "Red", image: "/Home-page/red_wenu_scooty.png" },
      { colour: "Grey", image: "/Home-page/grey_wenu_scooty.png" },
      { colour: "Blue", image: "/Home-page/blue_wenu_scooty.png" },
      { colour: "Green", image: "/Home-page/green_wenu_scooty.png" },
      { colour: "White", image: "/Home-page/white_wenu_scooty.png" },
    ],
  }),

  /**
   * Spot — sold in two packs, so the hero leads on the cheaper one and the
   * spec note carries both. `White_Spot_Scooty.png` is mixed case on disk;
   * referenced verbatim.
   */
  spot: sharedSpecBike({
    slug: "spot",
    name: "Venu Spot",
    tagline: "Sharp, sporty and street-ready. Made to be noticed.",
    packs: [
      { volts: 48, ah: 32, price: 35000 },
      { volts: 60, ah: 32, price: 38000 },
    ],
    rangeKm: 60,
    image: "/explore-pages/spot_bike.png",
    showcaseImage: "/Home-page/red_spot_scooty.png",
    showcaseSubject: "Venu Spot",
    stylingNote: "Sharp, sporty Spot styling",
    variants: [
      { colour: "Red", image: "/Home-page/red_spot_scooty.png" },
      { colour: "Grey", image: "/Home-page/grey_spot_scooty.png" },
      { colour: "Blue", image: "/Home-page/spot_blue_scooty.png" },
      { colour: "Green", image: "/Home-page/green_spot_scooty.png" },
      { colour: "White", image: "/Home-page/White_Spot_Scooty.png" },
    ],
  }),
}

export const BIKE_LIST = Object.values(BIKES)
