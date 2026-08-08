import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Fuel } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import SelectField from "@/components/form/SelectField"
import {
  CONTROLS,
  MODELS,
  RANGE_KM,
  UNITS_PER_FULL_CHARGE,
  calculateSavings,
  inr,
  inrPrecise,
} from "../savings"

/** Emerald track + a thumb big enough to grab on a touch screen. */
const sliderClass =
  "[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-neutral-200 " +
  "[&_[data-slot=slider-range]]:bg-emerald-500 " +
  "[&_[data-slot=slider-thumb]]:size-6 [&_[data-slot=slider-thumb]]:border-2 " +
  "[&_[data-slot=slider-thumb]]:border-emerald-500 [&_[data-slot=slider-thumb]]:ring-emerald-500/25"

function Control({ label, value, display, onChange, range, minLabel, maxLabel }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-neutral-800">{label}</span>
        <span className="text-sm font-semibold text-neutral-900">{display}</span>
      </div>

      <Slider
        aria-label={label}
        className={`mt-3 ${sliderClass}`}
        value={[value]}
        min={range.min}
        max={range.max}
        step={range.step}
        onValueChange={([next]) => onChange(next)}
      />

      <div className="mt-2 flex justify-between text-xs text-neutral-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

function CompareRow({ label, petrol, ev, highlight }) {
  return (
    <tr className={highlight ? "bg-emerald-50/60" : "odd:bg-neutral-50/70"}>
      <th scope="row" className="px-4 py-3 text-left text-sm font-normal text-neutral-500">
        {label}
      </th>
      <td className="px-4 py-3 text-right text-sm text-neutral-700 tabular-nums">{petrol}</td>
      <td
        className={`px-4 py-3 text-right text-sm tabular-nums ${
          highlight ? "font-semibold text-emerald-700" : "font-medium text-neutral-900"
        }`}
      >
        {ev}
      </td>
    </tr>
  )
}

export default function SavingsCalculator() {
  const [modelName, setModelName] = useState(MODELS[0].name)
  const [dailyKm, setDailyKm] = useState(CONTROLS.dailyKm.initial)
  const [mileage, setMileage] = useState(CONTROLS.mileage.initial)
  const [petrolPrice, setPetrolPrice] = useState(CONTROLS.petrolPrice.initial)
  const [tariff, setTariff] = useState(CONTROLS.tariff.initial)

  const model = MODELS.find((m) => m.name === modelName) ?? MODELS[0]
  const result = useMemo(
    () => calculateSavings({ dailyKm, mileage, petrolPrice, tariff }),
    [dailyKm, mileage, petrolPrice, tariff]
  )

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
        Savings calculator
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
        See what your daily commute costs on petrol — and what it costs on a Venu.
      </p>

      <div className="mt-6">
        <SelectField
          id="savings-model"
          label="Pick your Venu"
          value={modelName}
          onChange={setModelName}
          options={MODELS.map((m) => m.name)}
        />
      </div>

      {/* Headline result — the one number the page exists to show */}
      <div className="mt-6 rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-600/10">
        <p className="text-sm font-medium text-emerald-800">You could save</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-emerald-700 md:text-[2.75rem]">
          {inr(result.monthly.saved)}
          <span className="text-lg font-semibold text-emerald-700/70"> /month</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-emerald-900/70">
          <span>
            <strong className="font-semibold text-emerald-800">
              {inr(result.yearly.saved)}
            </strong>{" "}
            a year
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Fuel className="size-4" />
            <strong className="font-semibold text-emerald-800">
              {Math.round(result.litresSavedPerYear).toLocaleString("en-IN")} litres
            </strong>{" "}
            of petrol not burnt
          </span>
        </div>
      </div>

      {/* Inputs */}
      <div className="mt-8 space-y-7">
        <Control
          label="Daily commute"
          value={dailyKm}
          display={`${dailyKm} km`}
          onChange={setDailyKm}
          range={CONTROLS.dailyKm}
          minLabel="5 km"
          maxLabel="100 km"
        />
        <Control
          label="Your petrol vehicle's mileage"
          value={mileage}
          display={`${mileage} km/l`}
          onChange={setMileage}
          range={CONTROLS.mileage}
          minLabel="20 km/l"
          maxLabel="80 km/l"
        />
        <Control
          label="Petrol price"
          value={petrolPrice}
          display={`₹${petrolPrice}/litre`}
          onChange={setPetrolPrice}
          range={CONTROLS.petrolPrice}
          minLabel="₹90"
          maxLabel="₹130"
        />
        <Control
          label="Your electricity tariff"
          value={tariff}
          display={`₹${tariff.toFixed(1)}/unit`}
          onChange={setTariff}
          range={CONTROLS.tariff}
          minLabel="₹4"
          maxLabel="₹14"
        />
      </div>

      {/* Side-by-side breakdown */}
      <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-black/[0.07]">
        {/* aria-label rather than a <caption class="sr-only">: an absolutely
            positioned caption has no positioned ancestor to anchor to, so it
            escapes the page's overflow clip and adds phantom scroll height. */}
        <table
          className="w-full border-collapse"
          aria-label={`Running cost compared: your petrol vehicle versus the ${model.name}`}
        >
          <thead>
            <tr className="bg-white">
              <th className="px-4 py-3" />
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-400"
              >
                Petrol
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-500"
              >
                {model.shortName}
              </th>
            </tr>
          </thead>
          <tbody>
            <CompareRow
              label="Running cost"
              petrol={`${inrPrecise(result.perKm.petrol)}/km`}
              ev={`${inrPrecise(result.perKm.ev)}/km`}
            />
            <CompareRow
              label="Per day"
              petrol={inr(result.daily.petrol)}
              ev={inr(result.daily.ev)}
            />
            <CompareRow
              label="Per month"
              petrol={inr(result.monthly.petrol)}
              ev={inr(result.monthly.ev)}
            />
            <CompareRow
              label="Per year"
              petrol={inr(result.yearly.petrol)}
              ev={inr(result.yearly.ev)}
              highlight
            />
          </tbody>
        </table>
      </div>

      <Link
        to={`/${model.slug}`}
        className="group mt-8 inline-flex h-13 w-full items-center justify-center gap-2 rounded-sm bg-neutral-900 px-8 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 sm:w-auto"
      >
        Explore the {model.shortName}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>

      <p className="mt-6 text-xs leading-relaxed text-neutral-400">
        Indicative only. Electricity cost assumes about {UNITS_PER_FULL_CHARGE} units per
        full charge for {RANGE_KM} km of range; a month is counted as 30 days. Real figures
        vary with load, terrain, riding style and local tariffs.
      </p>
    </div>
  )
}
