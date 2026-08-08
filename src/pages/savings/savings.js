import { BIKE_LIST } from "@/pages/explore/bikes"

/**
 * Petrol-vs-electric running cost model.
 *
 * RANGE_KM is the 100 km per charge every model's sheet quotes (see bikes.js),
 * which is why the model picker changes the name and CTA but not the maths —
 * the range is common across the line-up.
 */
export const RANGE_KM = 100

/**
 * ESTIMATE, NOT A SPEC. The sheets don't publish battery capacity in kWh, so
 * this is a conservative figure for a 100 km low-speed e-scooter. Every
 * electricity cost on the page derives from it — swap in the real number when
 * it's confirmed and the whole calculator updates.
 */
export const UNITS_PER_FULL_CHARGE = 2.2

/** Slider ranges and their starting values. */
export const CONTROLS = {
  dailyKm: { min: 5, max: 100, step: 1, initial: 30 },
  mileage: { min: 20, max: 80, step: 1, initial: 45 },
  petrolPrice: { min: 90, max: 130, step: 1, initial: 105 },
  tariff: { min: 4, max: 14, step: 0.5, initial: 8 },
}

export const MODELS = BIKE_LIST.map((bike) => ({
  name: bike.name,
  slug: bike.slug,
  shortName: bike.shortName ?? bike.name,
}))

const DAYS_PER_MONTH = 30
const DAYS_PER_YEAR = 365

/**
 * @param {{ dailyKm: number, mileage: number, petrolPrice: number, tariff: number }} inputs
 * @returns per-km / daily / monthly / yearly cost for each, plus the difference
 */
export function calculateSavings({ dailyKm, mileage, petrolPrice, tariff }) {
  const petrolPerKm = petrolPrice / mileage
  const evPerKm = (UNITS_PER_FULL_CHARGE * tariff) / RANGE_KM

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
