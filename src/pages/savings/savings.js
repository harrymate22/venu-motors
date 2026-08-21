import { BIKE_LIST, packKwh } from "@/pages/explore/bikes"

/**
 * Petrol-vs-electric running cost model.
 *
 * The maths is per-model: range and battery pack both vary across the line-up
 * (60 km / 32Ah on Thunder and Spot, 80 km / 42Ah on Icon and E-Fly), so
 * picking a different model genuinely changes the per-km cost.
 */

/**
 * Charger and pack losses — the wall draws more than the pack stores. 15% is
 * the usual allowance for a lead/graphene pack on a basic charger.
 */
const CHARGING_EFFICIENCY = 0.85

/** Units of electricity a full charge draws, from the pack's actual kWh. */
export const unitsPerFullCharge = (pack) => packKwh(pack) / CHARGING_EFFICIENCY

/** Slider ranges and their starting values. */
export const CONTROLS = {
  dailyKm: { min: 5, max: 100, step: 1, initial: 30 },
  mileage: { min: 20, max: 80, step: 1, initial: 45 },
  petrolPrice: { min: 90, max: 130, step: 1, initial: 105 },
  tariff: { min: 4, max: 14, step: 0.5, initial: 8 },
}

/**
 * Only models with a published range can be costed, which for now leaves Wenu
 * out of the picker — see the note at the top of bikes.js.
 */
export const MODELS = BIKE_LIST.filter((bike) => bike.rangeKm && bike.packs).map((bike) => ({
  name: bike.name,
  slug: bike.slug,
  shortName: bike.shortName ?? bike.name,
  rangeKm: bike.rangeKm,
  /** Cheapest pack — the one the headline price quotes. */
  units: unitsPerFullCharge(bike.packs.reduce((a, b) => (b.price < a.price ? b : a))),
}))

const DAYS_PER_MONTH = 30
const DAYS_PER_YEAR = 365

/**
 * @param {{ dailyKm: number, mileage: number, petrolPrice: number, tariff: number,
 *   units: number, rangeKm: number }} inputs — `units` and `rangeKm` come from
 *   the selected model.
 * @returns per-km / daily / monthly / yearly cost for each, plus the difference
 */
export function calculateSavings({ dailyKm, mileage, petrolPrice, tariff, units, rangeKm }) {
  const petrolPerKm = petrolPrice / mileage
  const evPerKm = (units * tariff) / rangeKm

  const span = (days) => {
    const petrol = petrolPerKm * dailyKm * days
    const ev = evPerKm * dailyKm * days
    return { petrol, ev, saved: petrol - ev }
  }

  return {
    perKm: { petrol: petrolPerKm, ev: evPerKm, saved: petrolPerKm - evPerKm },
    daily: span(1),
    monthly: span(DAYS_PER_MONTH),
    yearly: span(DAYS_PER_YEAR),
    /** Litres of petrol a year this replaces — a more tangible figure than ₹. */
    litresSavedPerYear: (dailyKm * DAYS_PER_YEAR) / mileage,
  }
}

/** ₹1,23,456 — Indian digit grouping. */
export const inr = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`

/** ₹1.75 — for per-km figures where rounding to rupees would lose everything. */
export const inrPrecise = (value) => `₹${value.toFixed(2)}`
