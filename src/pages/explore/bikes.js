/**
 * Bike catalogue — keyed by URL slug (e.g. /thunder).
 * Add a new bike here and it gets its own page automatically.
 *
 * TWO SOURCES, kept deliberately apart:
 *
 * 1. The model spec posters (the Venu Motors product catalogue) are the source
 *    for every mechanical and feature spec — motor, top speed, brakes, tyres,
 *    load capacity, gradeability, display, ride modes, water resistance,
 *    charging time, battery options, and the finishes each model is sold in.
 * 2. The sales team's price list is the source for prices and for what each
 *    price actually buys:
 *
 *      Thunder    60V 32Ah              ₹45,000            60 km
 *      E-Fly      60V 42Ah              ₹59,000            80 km
 *      Icon       60V 42Ah              ₹60,000            80 km
 *      Spot       48V 32Ah / 60V 32Ah   ₹35,000 / ₹38,000  60 km
 *      E-Fighter  graphene / lithium    ₹65,000 / ₹82,000  60–100 km
 *
 * The catalogue quotes a 60–100 km band because any model can be ordered with a
 * 48V, 60V or 72V pack. Where the price list names the pack we stock, that
 * pack's own range is the more useful number, so those models quote a single
 * figure and the band shows up as the battery-option spec instead.
 *
 * E-Fighter is the exception twice over. It is priced by chemistry rather than
 * by pack size, and the list names no size for either option — so it quotes the
 * band, and it can't be costed in the savings calculator (see `costablePacks`).
 * It is also the only model sold with a lithium-ion pack, and the only one with
 * disc brakes at both ends.
 *
 * Charging time follows the chemistry rather than the model: every graphene pack
 * in the range takes a full night, lithium-ion roughly half that.
 *
 * @typedef {Object} Stat    { value, label }
 * @typedef {Object} SpecRow { label, value }
 */

/** ₹45,000 — Indian digit grouping. */
const inr = (value) => `₹${value.toLocaleString("en-IN")}`

/** "Gray / Silver" → "gray-silver", so catalogue colour names are safe as ids. */
const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

/** ["A", "B", "C"] → "A, B & C" — for reading a colour list out in a sentence. */
const listNames = (names) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} & ${names.at(-1)}` : names[0]

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven"]
/** 5 → "five", so headings read as copy rather than as data. */
export const numberWord = (n) => NUMBER_WORDS[n] ?? String(n)

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

/**
 * Figures the catalogue prints identically on every model's spec panel. Kept in
 * one object so a range-wide change is a one-line edit, and so nothing can claim
 * a different top speed or load capacity on one page than on another.
 */
export const COMMON_SPECS = {
  motorPower: "250W",
  topSpeed: "25 km/h",
  /** Across the 48V / 60V / 72V options — see the header note. */
  rangeBand: "60–100 km",
  batteryOptions: "48V / 60V / 72V",
  loadCapacity: "150 kg",
  gradeability: "15°",
  display: "Digital LCD",
  rideModes: "Eco / Normal / Power",
  waterResistance: "IP54",
}

/** The catalogue's own footnote, carried onto every model page. */
const SPEC_DISCLAIMER =
  "Range and speed may vary with road conditions, rider weight and battery type."

/**
 * Charging time is a property of the pack, not of the model — so it's keyed by
 * chemistry and a model never states one of its own. A model sold with a choice
 * of chemistry (E-Fighter) leads on what its cheapest pack charges in, and
 * surfaces the faster option alongside rather than burying it.
 */
const CHARGE_TIME = {
  Graphene: "8–10 hrs",
  "Lithium-ion": "4–5 hrs",
}

/**
 * Brake packages. `short` is the bento card title, `label` the spec-table value,
 * and `front`/`rear` the rows in the mechanical breakdown.
 */
const BRAKES_DISC_DRUM = {
  short: "Disc + drum brakes",
  label: "Front disc, rear drum",
  front: "Disc",
  rear: "Drum",
}
const BRAKES_DUAL_DISC = {
  short: "Front & rear disc",
  label: "Front & rear disc",
  front: "Disc",
  rear: "Disc",
}

/**
 * A pack is one thing the model is sold as, with its price.
 *
 * Most are described by size — volts + amp-hours rather than a display string,
 * so the label ("60V 32Ah") and the energy in kWh both derive from one number
 * each. E-Fighter's two options are described by chemistry instead, because that
 * is what its price list distinguishes and no size is given for either.
 *
 * @typedef {Object} Pack { price, volts?, ah?, chemistry? }
 */
const packLabel = (pack) => (pack.volts && pack.ah ? `${pack.volts}V ${pack.ah}Ah` : pack.chemistry)

export const packKwh = ({ volts, ah }) => (volts * ah) / 1000

/**
 * The packs a full charge can be costed against. A pack named only by chemistry
 * has no kWh to work from, so the savings calculator has to skip it — filtering
 * here rather than in the calculator keeps that rule next to the data it's about.
 */
export const costablePacks = (packs = []) => packs.filter((pack) => pack.volts && pack.ah)

/**
 * Every finish the catalogue names, with the paint swatch (`hex`) and a readable
 * label colour (`accent`). Models pick from this by name, so a colour can only
 * reach a page if it is spelled here exactly as the catalogue spells it — which
 * is what stops an unlisted finish quietly reappearing.
 */
export const FINISHES = {
  Black: { hex: "#1C1C1E", accent: "#3F3F46" },
  Blue: { hex: "#2F5FE0", accent: "#2563EB" },
  Green: { hex: "#3FA34D", accent: "#16A34A" },
  "Gray / Silver": { hex: "#B7BBBF", accent: "#6B7280" },
  "Red / Mehrun": { hex: "#B22234", accent: "#BE123C" },
  "Aqua Green": { hex: "#35B0A0", accent: "#0D9488" },
  "Mat Blue": { hex: "#2E4A7D", accent: "#1D4ED8" },
  "Cherry Red": { hex: "#B3121F", accent: "#BE123C" },
  Grey: { hex: "#8A8F94", accent: "#6B7280" },
}

/** Spot and Thunder share one catalogue palette; Icon and E-Fly share another. */
const SPORT_FINISHES = ["Black", "Blue", "Green", "Gray / Silver", "Red / Mehrun"]
const FAMILY_FINISHES = ["Aqua Green", "Mat Blue", "Cherry Red"]

/**
 * Hero stats. Range leads, then the two figures a buyer cross-shops models on.
 * "0 emissions" closes the row because it is the reason for the whole range.
 */
function heroStats({ rangeText, chargeTime }) {
  return [
    { value: rangeText, label: "Range / charge" },
    { value: chargeTime, label: "Charging time" },
    { value: COMMON_SPECS.topSpeed, label: "Top speed" },
    { value: "0", label: "Emissions" },
  ]
}

function highlightList({ rangeKm, rangeText, chemistry, chargeTime, extra = [] }) {
  return [
    "100% eco-friendly vehicle",
    "Charge at home",
    rangeKm ? `Up to ${rangeKm} km on a single charge` : `${rangeText} on a single charge`,
    "Made for Indian conditions",
    `${chemistry} battery`,
    `${chargeTime} charging time`,
    ...extra,
  ]
}

/** The three figures on a colour card, plus the claims that fit under them. */
function variantSpecs({ rangeText, chargeTime, brakes }) {
  return {
    columns: [
      { value: rangeText, label: "Range / charge" },
      { value: chargeTime, label: "Charging time" },
      { value: COMMON_SPECS.topSpeed, label: "Top speed" },
    ],
    bullets: [
      `${brakes.label} brakes`,
      "Eco, Normal & Power ride modes",
      "Keyless entry & anti-theft",
    ],
  }
}

/**
 * The yes/no spec table. Catalogue rows come first because they are what a buyer
 * cross-shops on; the equipment the catalogue doesn't itemise (but the earlier
 * spec sheet did) follows underneath.
 */
function keyFeatures({ batteryValue, rangeText, chargeTime, brakes, tyreValue, extra = [] }) {
  return [
    { label: "Motor power", value: COMMON_SPECS.motorPower },
    { label: "Top speed", value: COMMON_SPECS.topSpeed },
    { label: "Range per charge", value: rangeText },
    { label: "Battery", value: batteryValue },
    { label: "Battery options", value: COMMON_SPECS.batteryOptions },
    { label: "Charging time", value: chargeTime },
    { label: "Brakes", value: brakes.label },
    { label: "Tyres", value: tyreValue },
    { label: "Load capacity", value: COMMON_SPECS.loadCapacity },
    { label: "Gradeability", value: COMMON_SPECS.gradeability },
    { label: "Display", value: COMMON_SPECS.display },
    { label: "Ride modes", value: COMMON_SPECS.rideModes },
    { label: "Reverse mode", value: "Yes" },
    { label: "Water resistance", value: COMMON_SPECS.waterResistance },
    { label: "Keyless entry", value: "Yes" },
    { label: "Anti theft", value: "Yes" },
    { label: "Central lock", value: "Yes" },
    { label: "USB charging port", value: "Yes" },
    { label: "Charger", value: "Yes" },
    ...extra,
    { label: "Registration", value: "Not required" },
    { label: "Driving licence", value: "Not required" },
  ]
}

/**
 * The mechanical breakdown. Suspension, tyre number and kerb weight are only
 * documented for Thunder, so those rows appear only where we have them rather
 * than being invented for the rest of the range.
 */
function specGroups({
  batteryValue,
  rangeText,
  chargeTime,
  brakes,
  wheelSize,
  suspension,
  tyreNumber,
  kerbWeight,
}) {
  return [
    {
      title: "Battery & range",
      rows: [
        { label: "Battery", value: batteryValue },
        { label: "Battery options", value: COMMON_SPECS.batteryOptions },
        { label: "Range per charge", value: rangeText },
        { label: "Charging time", value: chargeTime },
      ],
    },
    {
      title: "Motor & performance",
      rows: [
        { label: "Motor power", value: COMMON_SPECS.motorPower },
        { label: "Top speed", value: COMMON_SPECS.topSpeed },
        { label: "Gradeability", value: COMMON_SPECS.gradeability },
        { label: "Ride modes", value: COMMON_SPECS.rideModes },
      ],
    },
    ...(suspension ? [{ title: "Suspension", rows: suspension }] : []),
    {
      title: "Brake system",
      rows: [
        { label: "Front", value: brakes.front },
        { label: "Rear", value: brakes.rear },
      ],
    },
    {
      title: "Tyre",
      rows: [
        { label: "Front & Rear", value: `${wheelSize} tubeless` },
        ...(tyreNumber ? [{ label: "Tyre number", value: tyreNumber }] : []),
      ],
    },
    {
      title: "Body spec",
      rows: [
        ...(kerbWeight ? [{ label: "Kerb weight", value: kerbWeight }] : []),
        { label: "Load capacity", value: COMMON_SPECS.loadCapacity },
        { label: "Head light", value: "LED" },
        { label: "Display", value: COMMON_SPECS.display },
        { label: "Water resistance", value: COMMON_SPECS.waterResistance },
      ],
    },
  ]
}

/**
 * Service copy is range-wide — doorstep pickup, insurance and warranty apply to
 * every model. The imagery is not: the detail photos under /explore-pages are
 * all a branded red Thunder, so a model without its own service photography
 * illustrates these cards with its own studio shots instead.
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
 * overflow it, so they drop to the subtitle. With no priced pack at all
 * (E-Fighter) the chemistry leads and the catalogue's options follow.
 */
function batteryCard({ battery, packs, chemistries }) {
  const chemistryLabel = chemistries.join(" or ")
  if (!packs) return { title: `${chemistryLabel} battery`, subtitle: `${battery} options` }
  if (packs.length === 1) {
    return { title: battery, subtitle: `${chemistryLabel} — fast, durable and reliable` }
  }
  // With more than one pack the title names whichever axis they differ on.
  return chemistries.length > 1
    ? { title: "Two battery options", subtitle: `${battery} — pick your chemistry` }
    : { title: `${chemistryLabel} battery`, subtitle: `${battery} — pick your pack` }
}

/**
 * Builds the three bento tabs. Slots 0/2/4 are the tall cards, and the six photo
 * slots are drawn only from the model's own shots — Thunder's detail photos all
 * show a branded red Thunder, so reusing them elsewhere would put the wrong
 * scooter on the page. Everything else falls back to a tint.
 *
 * `icon` is a lucide name resolved in BikeFeatures; adding a new one here means
 * registering it in that component's ICONS map too.
 */
function sharedFeatureTabs({
  pick,
  stylingNote,
  rangeKm,
  rangeText,
  battery,
  packs,
  chemistries,
  chargeTime,
  fastCharge,
  brakes,
  wheelSize,
  finishes,
}) {
  return [
    {
      id: "performance",
      label: "Performance",
      title: "Performance",
      subtitle: "Ready. Set. Ride.",
      cards: [
        {
          icon: "Gauge",
          title: rangeKm ? `Up to ${rangeKm} km` : rangeText,
          subtitle: "Go the distance on a single charge",
          image: pick(0),
        },
        { icon: "Zap", title: "3 ride modes", subtitle: "Eco, Normal & Power", tint: "rose" },
        { icon: "BatteryCharging", ...batteryCard({ battery, packs, chemistries }), image: pick(1) },
        {
          icon: "Timer",
          title: `${chargeTime} charging`,
          // Where a dearer pack charges faster, say so here rather than letting
          // the headline figure stand for both.
          subtitle: fastCharge ?? "Charge at home overnight",
          tint: "cream",
        },
        { icon: "Disc", title: brakes.short, subtitle: "Confident stopping power", image: pick(2) },
        {
          icon: "Cog",
          title: `${COMMON_SPECS.motorPower} motor`,
          subtitle: `${COMMON_SPECS.topSpeed} top speed · ${COMMON_SPECS.gradeability} gradeability`,
          tint: "cream",
        },
      ],
    },
    {
      id: "design",
      label: "Design",
      title: "Design",
      subtitle: "Made to turn heads.",
      cards: [
        {
          icon: "Palette",
          title: `${finishes.length} bold colours`,
          subtitle: listNames(finishes),
          image: pick(3),
        },
        { icon: "Lightbulb", title: "LED headlamp", subtitle: "Better visibility", tint: "rose" },
        {
          icon: "Gauge",
          title: "Digital LCD display",
          subtitle: "Smart & clear, at a glance",
          tint: "sky",
        },
        {
          icon: "CircleDot",
          title: "Tubeless tyres",
          subtitle: `Front ${wheelSize} – Rear ${wheelSize}`,
          tint: "cream",
        },
        {
          icon: "Box",
          title: "Spacious boot space",
          subtitle: "For your essentials",
          image: pick(4),
        },
        { icon: "Sparkles", title: "Bold graphics", subtitle: stylingNote, tint: "cream" },
      ],
    },
    {
      id: "technology",
      label: "Technology",
      title: "Technology",
      subtitle: "Smarts that redefine your ride.",
      cards: [
        { icon: "KeyRound", title: "Keyless entry", subtitle: "Walk up and go", image: pick(5) },
        {
          icon: "ShieldCheck",
          title: "Anti-theft + central lock",
          subtitle: "Total peace of mind",
          tint: "rose",
        },
        {
          icon: "Droplets",
          title: `${COMMON_SPECS.waterResistance} water resistance`,
          subtitle: "Rain-ready, every season",
          tint: "sky",
        },
        {
          icon: "Usb",
          title: "USB charging port",
          subtitle: "Power your phone on the go",
          tint: "cream",
        },
        {
          icon: "RotateCcw",
          title: "Reverse & cruise mode",
          subtitle: "Effortless parking and steady cruising",
          tint: "mint",
        },
        {
          icon: "FileCheck",
          title: "No registration or licence",
          subtitle: "Ride completely hassle-free",
          tint: "cream",
        },
      ],
    },
  ]
}

/**
 * One catalogue entry. Every model in the range is built through here, so a
 * range-wide figure can only be stated once.
 *
 * PRICE-LESS: with no `packs` an entry falls back to `priceLabel`. BikeHero and
 * BikeColours read that as "enquire" rather than "buy", BookingPage bounces
 * /<slug>/book back to the model page, and the savings calculator skips the
 * model. Every model in the range is priced right now, so nothing takes this
 * path — it's kept for the next model that arrives before its price does.
 *
 * `packs` lists what the model is sold as, each option with its price. Most vary
 * by pack size (one for Thunder, Icon and E-Fly, two for Spot); E-Fighter varies
 * by chemistry instead. The headline price is the cheapest option, and where
 * there's more than one they're all spelled out in `specNote`.
 *
 * COLOURS come from `finishes` (the catalogue's list, in its order) and `shots`
 * (the studio photography we actually have). Every listed finish reaches the
 * configurator through `colours`; only the ones with a shot get a card in the
 * colour carousel through `variants`, so a card can never show blue paint under
 * a "Red" label. `stageShots` overrides the configurator's backdrop where a
 * model has dedicated stage photography.
 *
 * @param {{ slug: string, name: string, shortName?: string, eyebrow: string,
 *   tagline: string, packs?: Pack[], rangeKm?: number, chemistry?: string,
 *   brakes: object, wheelSize: string, image: string,
 *   showcaseImage: string, showcaseSubject: string, stylingNote: string,
 *   finishes: string[], shots?: Record<string, string>,
 *   stageShots?: Record<string, string>, featureShots?: string[],
 *   serviceShots?: string[], suspension?: SpecRow[], tyreNumber?: string,
 *   kerbWeight?: string, warranty?: Stat[], extraKeyFeatures?: SpecRow[],
 *   extraHighlights?: string[] }} config
 */
function sharedSpecBike({
  slug,
  name,
  shortName,
  eyebrow,
  tagline,
  packs,
  rangeKm,
  chemistry = "Graphene",
  brakes,
  wheelSize,
  image,
  showcaseImage,
  showcaseSubject,
  stylingNote,
  finishes,
  shots = {},
  stageShots = {},
  featureShots,
  serviceShots,
  suspension,
  tyreNumber,
  kerbWeight,
  warranty,
  extraKeyFeatures,
  extraHighlights,
}) {
  const short = shortName ?? name.replace(/^Venu\s/, "")

  // Only finishes we can actually show get a card; the rest still reach the
  // configurator, which tints a swatch rather than needing a photo.
  const shotFinishes = finishes.filter((colour) => shots[colour])
  const gallery = shotFinishes.map((colour) => shots[colour])
  const cycle = (list) => (i) => (list.length ? list[i % list.length] : undefined)
  const pick = cycle(featureShots ?? gallery)

  // Cheapest pack leads; the hero already frames `price` as "Starting at".
  const headline = packs && packs.reduce((a, b) => (b.price < a.price ? b : a))

  // Chemistry is a property of the pack. Models sold in one chemistry declare it
  // once on the entry; E-Fighter's packs each carry their own.
  const chemistryOf = (pack) => pack.chemistry ?? chemistry
  const chemistries = packs ? [...new Set(packs.map(chemistryOf))] : [chemistry]
  const chemistryLabel = chemistries.join(" or ")

  // Charging time follows from that, so the headline is what the cheapest pack
  // charges in — and any pack that charges faster gets called out beside it.
  const chargeTime = CHARGE_TIME[headline ? chemistryOf(headline) : chemistry]
  const fastCharge = packs
    ?.map(chemistryOf)
    .filter((c) => CHARGE_TIME[c] !== chargeTime)
    .map((c) => `${CHARGE_TIME[c]} with the ${c.toLowerCase()} pack`)[0]

  const battery = packs ? packs.map(packLabel).join(" / ") : COMMON_SPECS.batteryOptions
  // A pack named by size still needs its chemistry spelling out; one named by
  // chemistry already carries it.
  const namedBySize = !packs || packs.every((pack) => pack.volts && pack.ah)
  const batteryValue = namedBySize ? `${battery} ${chemistryLabel.toLowerCase()}` : battery

  // Without a sized pack we can only stand behind the catalogue's band.
  const rangeText = rangeKm ? `${rangeKm} km` : COMMON_SPECS.rangeBand
  const tyreValue = `Front ${wheelSize} – Rear ${wheelSize} tubeless`

  // Two packs means two prices, so the note carries both; one pack just names it.
  const packNote =
    packs && packs.length > 1
      ? packs.map((p) => `${packLabel(p)} ${inr(p.price)}`).join(" · ")
      : batteryValue

  return {
    slug,
    name,
    shortName: short,
    eyebrow,
    tagline,
    ...(headline ? { price: inr(headline.price) } : { priceLabel: "Price on request" }),
    image,

    battery,
    // The chemistry as it should be read out ("Graphene", or "Graphene or
    // Lithium-ion"), and the headline charging time that follows from it.
    chemistry: chemistryLabel,
    chemistries,
    chargeTime,
    brakes,
    wheelSize,
    // The range as it should be printed: a priced pack's own figure where we
    // have one, the catalogue's band where we don't. `rangeKm` stays numeric and
    // absent-when-unknown, which is what the savings calculator filters on.
    rangeText,
    ...(packs ? { packs } : {}),
    ...(rangeKm ? { rangeKm } : {}),

    heroStats: heroStats({ rangeText, chargeTime }),
    specNote: `Specs of the ${name} · ${packNote} · ${SPEC_DISCLAIMER}`,

    showcase: {
      title: `The all-new ${showcaseSubject}`,
      image: showcaseImage,
      features: [
        "Keyless entry & anti-theft",
        `${brakes.label} brakes`,
        rangeKm ? `Up to ${rangeKm} km range` : `${COMMON_SPECS.rangeBand} range`,
        `Available in ${finishes.length} colours`,
      ],
    },

    highlights: highlightList({
      rangeKm,
      rangeText,
      chemistry: chemistryLabel,
      chargeTime,
      extra: extraHighlights,
    }),

    // Every catalogue finish, in catalogue order. `bg` is the configurator stage
    // image, which falls back to the colour's own studio shot where there is no
    // dedicated backdrop, and is left off entirely where there is neither —
    // BookingPage then holds the first stage shot it does have.
    colours: finishes.map((colour) => {
      const bg = stageShots[colour] ?? shots[colour]
      return { name: colour, hex: FINISHES[colour].hex, ...(bg ? { bg } : {}) }
    }),

    variants: shotFinishes.map((colour) => ({
      id: `${slug}-${slugify(colour)}`,
      colour,
      accent: FINISHES[colour].accent,
      image: shots[colour],
    })),
    variantSpecs: variantSpecs({ rangeText, chargeTime, brakes }),

    keyFeatures: keyFeatures({
      batteryValue,
      rangeText,
      chargeTime,
      brakes,
      tyreValue,
      extra: extraKeyFeatures,
    }),
    specGroups: specGroups({
      batteryValue,
      rangeText,
      chargeTime,
      brakes,
      wheelSize,
      suspension,
      tyreNumber,
      kerbWeight,
    }),
    ...(warranty ? { warranty } : {}),

    service: sharedService(cycle(serviceShots ?? gallery)),
    featureTabs: sharedFeatureTabs({
      pick,
      stylingNote,
      rangeKm,
      rangeText,
      battery,
      packs,
      chemistries,
      chargeTime,
      fastCharge,
      brakes,
      wheelSize,
      finishes,
    }),

    ...(headline
      ? {
          booking: {
            bookingAmount: "₹999",
            emi: monthlyEmi(headline.price),
            range: rangeText,
            benefitsNote: "No registration or licence needed — ride completely hassle-free.",
          },
        }
      : {}),
  }
}

export const BIKES = {
  /**
   * Thunder — the only model with documented suspension, tyre number and kerb
   * weight, and the only one with its own detail and service photography, so it
   * passes explicit `featureShots` / `serviceShots` instead of cycling colours.
   */
  thunder: sharedSpecBike({
    slug: "thunder",
    name: "Venu Thunder",
    eyebrow: "POWER · PERFORMANCE · ELECTRIC",
    tagline: "Bold looks. Effortless range. Made for every Indian road.",
    packs: [{ volts: 60, ah: 32, price: 45000 }],
    rangeKm: 60,
    brakes: BRAKES_DISC_DRUM,
    wheelSize: '10"',
    image: "/explore-pages/thunder_bike.png",
    showcaseImage: "/explore-pages/thunder_bike_x1.png",
    showcaseSubject: "Venu Thunder X1",
    stylingNote: "Head-turning Thunder styling",
    finishes: SPORT_FINISHES,
    shots: {
      "Red / Mehrun": "/Home-page/red_thunder_scooty.png",
      Blue: "/Home-page/blue_thunder_scooty.png",
      "Gray / Silver": "/Home-page/grey_thunder_scooty.png",
    },
    // Dedicated configurator backdrops — a wider crop than the carousel shots.
    stageShots: {
      "Red / Mehrun": "/explore-pages/thunder_purchase_bg.png",
      Blue: "/explore-pages/thunder_blue_bg.png",
    },
    featureShots: [
      "/explore-pages/thunder_performance_category.png",
      "/explore-pages/thunder_battery.png",
      "/explore-pages/thunder_disc.png",
      "/explore-pages/thunder_bike.png",
      "/explore-pages/thunder_sit.png",
      "/explore-pages/thunder_bike.png",
    ],
    serviceShots: [
      "/explore-pages/thunder_disc.png",
      "/explore-pages/scooter_insurance.png",
      "/explore-pages/thunder_warranty.png",
    ],
    suspension: [
      { label: "Front", value: "Steel Hydraulic Cell Shocker" },
      { label: "Rear", value: "Steel Hydraulic Shocker" },
    ],
    tyreNumber: "90-90-10",
    kerbWeight: "80 kg",
    extraKeyFeatures: [{ label: "Portable battery", value: "No" }],
    warranty: [
      { value: "0", label: "Emissions" },
      { value: "1 yr", label: "Motor warranty" },
      { value: "1 yr", label: "Battery warranty" },
    ],
  }),

  /** Icon — Cherry Red still awaits its studio shot. Catalogue styles it "i-CON". */
  icon: sharedSpecBike({
    slug: "icon",
    name: "Venu Icon",
    eyebrow: "SMART · EFFICIENT · ELECTRIC",
    tagline: "Clean lines, calm ride. The everyday electric for Indian families.",
    packs: [{ volts: 60, ah: 42, price: 60000 }],
    rangeKm: 80,
    brakes: BRAKES_DISC_DRUM,
    wheelSize: '12"',
    image: "/explore-pages/icon_bike.png",
    showcaseImage: "/Home-page/icon_blue_scooty.png",
    showcaseSubject: "Venu Icon",
    stylingNote: "Smooth, understated Icon styling",
    finishes: FAMILY_FINISHES,
    shots: {
      "Aqua Green": "/Home-page/icon_green_scooty.png",
      "Mat Blue": "/Home-page/icon_blue_scooty.png",
    },
  }),

  /** E-Fly — every catalogue finish has its own shot. */
  efly: sharedSpecBike({
    slug: "efly",
    name: "Venu E-Fly",
    eyebrow: "SMART · EFFICIENT · ELECTRIC",
    tagline: "Light on its feet. Built for the daily city run.",
    packs: [{ volts: 60, ah: 42, price: 59000 }],
    rangeKm: 80,
    brakes: BRAKES_DISC_DRUM,
    wheelSize: '12"',
    image: "/explore-pages/efly_bike.png",
    showcaseImage: "/Home-page/red_efly_scooty.png",
    showcaseSubject: "Venu E-Fly",
    stylingNote: "Nimble, city-ready E-Fly styling",
    finishes: FAMILY_FINISHES,
    shots: {
      "Aqua Green": "/Home-page/green_efly_scooty.png",
      "Mat Blue": "/Home-page/blue_efly_scooty.png",
      "Cherry Red": "/Home-page/red_efly_scooty.png",
    },
  }),

  /**
   * E-Fighter — the newest model, and the only one sold with a choice of
   * chemistry: graphene at ₹65,000 or lithium-ion at ₹82,000. The price list
   * names no pack size for either, so it quotes the catalogue's 60–100 km band
   * where the rest of the range quotes one pack's own figure, and it stays out
   * of the savings calculator. It's also the only model with disc brakes at both
   * ends, and the lithium option is the only pack in the range that charges in
   * under five hours.
   *
   * PENDING PHOTOGRAPHY: none of the four `efighter` assets referenced below
   * exist under /public yet, so this page renders with missing images until they
   * land — and now that the model has a price, so does its configurator at
   * /efighter/book. The paths follow the range's naming, so dropping the files
   * in is all that's needed; nothing here has to change.
   */
  efighter: sharedSpecBike({
    slug: "efighter",
    name: "Venu E-Fighter",
    eyebrow: "SMART · EFFICIENT · ELECTRIC",
    tagline: "Disc brakes at both ends, and a lithium-ion option that charges in under five hours.",
    packs: [
      { chemistry: "Graphene", price: 65000 },
      { chemistry: "Lithium-ion", price: 82000 },
    ],
    brakes: BRAKES_DUAL_DISC,
    wheelSize: '12"',
    image: "/explore-pages/efighter_bike.png",
    showcaseImage: "/Home-page/black_efighter_scooty.png",
    showcaseSubject: "Venu E-Fighter",
    stylingNote: "Stylish graphics with a premium finish",
    finishes: ["Grey", "Cherry Red", "Black"],
    shots: {
      Grey: "/Home-page/grey_efighter_scooty.png",
      "Cherry Red": "/Home-page/red_efighter_scooty.png",
      Black: "/Home-page/black_efighter_scooty.png",
    },
    extraHighlights: ["LED tail lamp", "Comfortable seat for long rides"],
  }),

  /**
   * Spot — sold in two packs, so the hero leads on the cheaper one and the spec
   * note carries both. `White_Spot_Scooty.png` is deliberately unused: the
   * catalogue lists Black rather than White for the Spot.
   */
  spot: sharedSpecBike({
    slug: "spot",
    name: "Venu Spot",
    eyebrow: "SMART · STYLISH · ELECTRIC",
    tagline: "Sharp, sporty and street-ready. Made to be noticed.",
    packs: [
      { volts: 48, ah: 32, price: 35000 },
      { volts: 60, ah: 32, price: 38000 },
    ],
    rangeKm: 60,
    brakes: BRAKES_DISC_DRUM,
    wheelSize: '10"',
    image: "/explore-pages/spot_bike.png",
    showcaseImage: "/Home-page/red_spot_scooty.png",
    showcaseSubject: "Venu Spot",
    stylingNote: "Sharp, sporty Spot styling",
    finishes: SPORT_FINISHES,
    shots: {
      "Red / Mehrun": "/Home-page/red_spot_scooty.png",
      Blue: "/Home-page/spot_blue_scooty.png",
      Green: "/Home-page/green_spot_scooty.png",
      "Gray / Silver": "/Home-page/grey_spot_scooty.png",
    },
  }),
}

export const BIKE_LIST = Object.values(BIKES)
