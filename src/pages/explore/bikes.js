/**
 * Bike catalogue — keyed by URL slug (e.g. /thunder).
 * Add a new bike here and it gets its own page automatically.
 *
 * Specs sourced from the Venu Thunder spec sheet.
 *
 * @typedef {Object} Stat   { value, label }
 * @typedef {Object} SpecRow { label, value }
 */
export const BIKES = {
  thunder: {
    slug: "thunder",
    name: "Venu Thunder",
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

    colours: [
      { name: "Red", hex: "#D42A2A" },
      { name: "Grey", hex: "#9AA0A6" },
      { name: "Blue", hex: "#2F5FE0" },
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

    // Sticky-tab bento section (Performance / Design / Technology).
    // `icon` is a lucide name resolved in BikeFeatures; `span` shapes the bento.
    featureTabs: [
      {
        id: "performance",
        label: "Performance",
        title: "Performance",
        subtitle: "Ready. Set. Ride.",
        cards: [
          { icon: "Gauge", title: "Up to 100 km", subtitle: "Go the distance on a single charge", span: "big" },
          { icon: "Zap", title: "3 ride modes", subtitle: "Speed modes 1, 2 & 3" },
          { icon: "BatteryCharging", title: "Graphene battery", subtitle: "Fast, durable and reliable" },
          { icon: "Timer", title: "9–10 hrs charging", subtitle: "Charge at home overnight", span: "wide" },
          { icon: "Disc", title: "Disc + drum brakes", subtitle: "Confident stopping power" },
          { icon: "RotateCcw", title: "Reverse mode", subtitle: "Effortless parking, every time" },
        ],
      },
      {
        id: "design",
        label: "Design",
        title: "Design",
        subtitle: "Made to turn heads.",
        cards: [
          { icon: "Palette", title: "5 bold colours", subtitle: "Red, Grey, Blue, Green & White", span: "big" },
          { icon: "Lightbulb", title: "LED headlight", subtitle: "See and be seen" },
          { icon: "Gauge", title: "Digital speedometer", subtitle: "Ride data at a glance" },
          { icon: "CircleDot", title: "Tubeless tyres", subtitle: "90-90-10, worry-free", span: "wide" },
          { icon: "Armchair", title: "Comfort seat", subtitle: "Ergonomic for long rides" },
          { icon: "Sparkles", title: "Bold graphics", subtitle: "Head-turning Thunder styling" },
        ],
      },
      {
        id: "technology",
        label: "Technology",
        title: "Technology",
        subtitle: "Smarts that redefine your ride.",
        cards: [
          { icon: "KeyRound", title: "Keyless entry", subtitle: "Walk up and go", span: "big" },
          { icon: "ShieldCheck", title: "Anti-theft + central lock", subtitle: "Total peace of mind" },
          { icon: "Usb", title: "USB charging port", subtitle: "Power your phone on the go" },
          { icon: "Navigation", title: "Cruise mode", subtitle: "Effortless steady cruising", span: "wide" },
          { icon: "FileCheck", title: "No registration or licence", subtitle: "Ride completely hassle-free" },
          { icon: "PlugZap", title: "Portable charger", subtitle: "Charge anywhere, anytime" },
        ],
      },
    ],
  },
}

export const BIKE_LIST = Object.values(BIKES)
