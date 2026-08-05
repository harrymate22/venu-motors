/**
 * Bike catalogue — keyed by URL slug (e.g. /thunder).
 * Add a new bike here and it gets its own page automatically.
 *
 * Thunder's specs come from its own spec sheet. Icon, E-Fly, Wenu and Spot come
 * from sheets that all carry identical figures — 100 km per charge, 9–10 hr
 * charge, graphene battery, 80 kg, and the same five finishes — so they're built
 * by `sharedSpecBike()` rather than repeated four times. None of those sheets
 * lists a price, hence `priceLabel` instead of `price` (see PRICE-LESS below).
 *
 * @typedef {Object} Stat   { value, label }
 * @typedef {Object} SpecRow { label, value }
 */

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

/** Figures every non-Thunder sheet repeats verbatim. */
const SHARED_HERO_STATS = [
  { value: "100 km", label: "Range / charge" },
  { value: "9–10 hrs", label: "Charging time" },
  { value: "0", label: "Emissions" },
]

const SHARED_HIGHLIGHTS = [
  "100% eco-friendly vehicle",
  "Charge at home",
  "Up to 100 km on a single charge",
  "Made for Indian conditions",
  "Graphene battery",
  "9–10 hrs charging time",
]

const SHARED_VARIANT_SPECS = {
  columns: [
    { value: "100 km", label: "Range / charge" },
    { value: "9–10 hrs", label: "Charging time" },
    { value: "80 kg", label: "Kerb weight" },
  ],
  bullets: ["Keyless entry & anti-theft", "Reverse & cruise mode"],
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
 * Builds the three bento tabs. Slots 0/2/4 are the tall cards, and the photo
 * cards are drawn only from the model's own shots — Thunder's detail photos all
 * show a branded red Thunder, so reusing them here would put the wrong scooter
 * on the page. Everything else falls back to a tint.
 *
 * @param {{ pick: (i: number) => string, stylingNote: string }} config
 */
function sharedFeatureTabs({ pick, stylingNote }) {
  return [
    {
      id: "performance",
      label: "Performance",
      title: "Performance",
      subtitle: "Ready. Set. Ride.",
      cards: [
        { icon: "Gauge", title: "Up to 100 km", subtitle: "Go the distance on a single charge", image: pick(0) },
        { icon: "Zap", title: "3 ride modes", subtitle: "Speed modes 1, 2 & 3", tint: "rose" },
        { icon: "BatteryCharging", title: "Graphene battery", subtitle: "Fast, durable and reliable", image: pick(1) },
        { icon: "Timer", title: "9–10 hrs charging", subtitle: "Charge at home overnight", tint: "cream" },
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
 * One catalogue entry for a model whose sheet matches the shared figures.
 *
 * PRICE-LESS: these sheets carry no price, so the entry sets `priceLabel` and
 * omits `price`. BikeHero and BikeColours read that as "enquire" rather than
 * "buy", and BookingPage bounces /<slug>/book back to the model page — there's
 * nothing to configure a price against yet. Add `price` + `booking` when the
 * figures land and both flows light up on their own.
 *
 * `colours` deliberately lists only finishes with their own studio shot, so a
 * card never shows blue paint under a "Red" label. Those same shots are the only
 * photography these pages have, so `pick()` cycles them for the bento and
 * service cards.
 *
 * @param {{ slug: string, name: string, shortName?: string, tagline: string,
 *   image: string, showcaseImage: string, showcaseSubject: string,
 *   variants: { colour: string, image: string }[], stylingNote: string }} config
 */
function sharedSpecBike({
  slug,
  name,
  shortName,
  tagline,
  image,
  showcaseImage,
  showcaseSubject,
  variants,
  stylingNote,
}) {
  const short = shortName ?? name.replace(/^Venu\s/, "")
  const shots = variants.map((v) => v.image)
  const pick = (i) => shots[i % shots.length]

  return {
    slug,
    name,
    shortName: short,
    eyebrow: "INTRODUCING",
    tagline,
    priceLabel: "Price on request",
    image,

    heroStats: SHARED_HERO_STATS,
    specNote: `Specs of the ${name} · Graphene battery, built for Indian conditions.`,

    showcase: {
      title: `The all-new ${showcaseSubject}`,
      image: showcaseImage,
      features: [
        "Keyless entry & anti-theft",
        "Reverse & cruise mode",
        "Up to 100 km range",
        "Available in 5 colours",
      ],
    },

    highlights: SHARED_HIGHLIGHTS,
    colours: variants.map(({ colour }) => FINISHES.find((f) => f.name === colour)),

    variants: variants.map(({ colour, image: shot }) => ({
      id: `${slug}-${colour.toLowerCase()}`,
      colour,
      accent: VARIANT_ACCENTS[colour],
      image: shot,
    })),
    variantSpecs: SHARED_VARIANT_SPECS,

    keyFeatures: SHARED_KEY_FEATURES,
    service: sharedService(pick),
    featureTabs: sharedFeatureTabs({ pick, stylingNote }),

    // `specGroups` and `warranty` are Thunder-only for now — the mechanical
    // rows (suspension, brake, tyre size) aren't documented for these models.
  }
}

export const BIKES = {
  thunder: {
    slug: "thunder",
    name: "Venu Thunder",
    shortName: "Thunder",
    eyebrow: "INTRODUCING",
    tagline: "Bold looks. Effortless range. Made for every Indian road.",
    price: "₹53,000",
    image: "/explore-pages/thunder_bike.png",

    // Hero highlight stats
    heroStats: [
      { value: "100 km", label: "Range / charge" },
      { value: "9–10 hrs", label: "Charging time" },
      { value: "0", label: "Emissions" },
    ],
    specNote: "Specs of the Venu Thunder · Graphene battery, built for Indian conditions.",

    // "Ride the future" showcase — poster image carries the bike + display text
    showcase: {
      title: "The all-new Venu Thunder X1",
      image: "/explore-pages/thunder_bike_x1.png",
      features: [
        "Keyless entry & anti-theft",
        "Reverse & cruise mode",
        "Up to 100 km range",
        "Available in 5 colours",
      ],
    },

    // Quick highlights (icon badges)
    highlights: [
      "100% eco-friendly vehicle",
      "Charge at home",
      "Up to 100 km on a single charge",
      "Made for Indian conditions",
      "Graphene battery",
      "9–10 hrs charging time",
    ],

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
    variantSpecs: {
      columns: [
        { value: "100 km", label: "Range / charge" },
        { value: "9–10 hrs", label: "Charging time" },
        { value: "80 kg", label: "Kerb weight" },
      ],
      bullets: ["Keyless entry & anti-theft", "Reverse & cruise mode"],
    },

    // +Features (mechanical)
    specGroups: [
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
      emi: "₹1,499/mo",
      range: "100 km",
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
          { icon: "Gauge", title: "Up to 100 km", subtitle: "Go the distance on a single charge", image: "/explore-pages/thunder_performance_category.png" },
          { icon: "Zap", title: "3 ride modes", subtitle: "Speed modes 1, 2 & 3", tint: "rose" },
          { icon: "BatteryCharging", title: "Graphene battery", subtitle: "Fast, durable and reliable", image: "/explore-pages/thunder_battery.png" },
          { icon: "Timer", title: "9–10 hrs charging", subtitle: "Charge at home overnight", tint: "cream" },
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

  /** Spot — `White_Spot_Scooty.png` is mixed case on disk; referenced verbatim. */
  spot: sharedSpecBike({
    slug: "spot",
    name: "Venu Spot",
    tagline: "Sharp, sporty and street-ready. Made to be noticed.",
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
