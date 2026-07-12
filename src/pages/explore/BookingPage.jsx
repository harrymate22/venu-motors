import { useEffect, useState } from "react"
import { useParams, Navigate, Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Info, Pencil, X, LocateFixed } from "lucide-react"
import { BIKES } from "./bikes"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "colour", label: "Colour" },
  { id: "summary", label: "Summary" },
]

const CITIES = ["Bengaluru", "Ahmedabad", "Chennai", "Hyderabad", "Kochi", "Mumbai", "Pune"]

/** Navbar-style wordmark, dark variant for the light configurator stage. */
function Logo({ to }) {
  return (
    <Link to={to} className="select-none text-xl font-extrabold tracking-[0.18em] text-neutral-900">
      VENU<span className="font-medium text-neutral-500"> MOTORS</span>
    </Link>
  )
}

function Heading({ label, tag }) {
  return (
    <h2 className="text-2xl font-semibold tracking-tight">
      <span className="text-neutral-900">{label}</span>{" "}
      <span className="text-neutral-400">{tag}</span>
    </h2>
  )
}

function SummaryRow({ label, value, right }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div>
        <p className="font-semibold text-neutral-900">{label}</p>
        {value && <p className="mt-0.5 text-sm text-neutral-500">{value}</p>}
      </div>
      {right && <span className="shrink-0 text-sm font-medium text-neutral-600">{right}</span>}
    </div>
  )
}

function CityModal({ open, city, onSelect, onClose }) {
  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-neutral-400 transition-colors hover:text-neutral-700"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-center text-2xl font-bold text-neutral-900">Pick your city</h3>
            <p className="mt-1 text-center text-sm text-neutral-500">Get prices and offers in your city</p>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3">
              <div>
                <p className="text-xs text-neutral-400">City name*</p>
                <p className="font-medium text-neutral-900">{city}</p>
              </div>
              <LocateFixed className="size-5 text-neutral-500" />
            </div>

            <p className="mt-6 text-sm font-medium text-neutral-500">Popular Cities</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => onSelect(c)}
                  className={cn(
                    "rounded-full py-3 text-sm font-medium ring-1 transition",
                    c === city
                      ? "bg-white text-neutral-900 ring-neutral-900"
                      : "bg-neutral-50 text-neutral-600 ring-transparent hover:bg-neutral-100"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function BookingPage() {
  const { slug } = useParams()
  const bike = BIKES[slug]
  const [tab, setTab] = useState("colour")
  const [colourName, setColourName] = useState(bike?.colours?.[0]?.name)
  const [city, setCity] = useState("Bengaluru")
  const [cityOpen, setCityOpen] = useState(false)

  if (!bike) return <Navigate to="/" replace />

  const { name, price, booking, colours } = bike
  const colour = colours.find((c) => c.name === colourName) ?? colours[0]
  // All unique stage shots, kept mounted so colour swaps cross-fade without a reload flash.
  const stageImages = [...new Set(colours.map((c) => c.bg).filter(Boolean))]
  const stageImage = colour.bg ?? stageImages[0]

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    `I'm booking the ${name} in ${colour.name} — starting at ${price}!`
  )}`

  return (
    <div className="flex min-h-svh flex-col lg:h-svh lg:flex-row lg:overflow-hidden">
      {/* Left — stage */}
      <div className="relative flex h-[42svh] flex-col bg-[#E7E9EC] lg:h-auto lg:flex-1">
        <div className="flex items-center justify-between p-5 lg:p-8">
          <Logo to={`/${slug}`} />
          <button
            onClick={() => setCityOpen(true)}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm ring-1 ring-black/5 transition hover:shadow"
          >
            {city}
            <Pencil className="size-3.5 text-neutral-500" />
          </button>
        </div>
        {/* Product shot — all colour shots stay mounted; the active one cross-fades in */}
        <div className="-mt-6 flex min-h-0 flex-1 items-center justify-center px-4 pb-6 lg:px-8 lg:pb-8">
          <div className="relative h-full w-full max-w-4xl">
            {stageImages.map((src) => (
              <img
                key={src}
                src={src}
                alt={src === stageImage ? `${name} ${colour.name}` : ""}
                className={cn(
                  "absolute inset-0 m-auto max-h-full w-full object-contain transition-opacity duration-500 ease-out",
                  src === stageImage ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right — configuration panel */}
      <div className="flex w-full flex-col border-t border-neutral-200 bg-white lg:w-[508px] lg:border-l lg:border-t-0">
        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex rounded-full bg-neutral-100 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative flex-1 rounded-full py-2.5 text-sm font-medium transition-colors"
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="config-tab"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn("relative", tab === t.id ? "text-neutral-900" : "text-neutral-500")}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {tab === "colour" ? (
                <div>
                  <Heading label="Colour." tag="Express yourself" />
                  <div className="mt-6 rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">{colour.name}</span>
                      <span className="text-sm text-neutral-500">Included</span>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4">
                      {colours.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setColourName(c.name)}
                          aria-label={c.name}
                          aria-pressed={colour.name === c.name}
                          className={cn(
                            "size-12 rounded-full ring-1 ring-black/15 transition-all",
                            colour.name === c.name
                              ? "ring-2 ring-neutral-900 ring-offset-2 ring-offset-neutral-50"
                              : "hover:ring-black/25"
                          )}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Heading label="Summary." tag="Ready to ride" />

                  <SummaryRow label="Model" value={name} right={price} />

                  {booking?.benefitsNote && (
                    <div className="rounded-xl bg-[#EAF6EE] p-4 text-sm text-[#2f6b46]">
                      {booking.benefitsNote}
                    </div>
                  )}

                  <div className="space-y-4">
                    <SummaryRow label="Range" value={booking?.range} right="Included" />
                    <SummaryRow label="Colour" value={colour.name} right="Included" />
                    <SummaryRow label="Delivery city" value={city} right="Included" />
                  </div>

                  <hr className="border-neutral-200" />

                  <div className="flex items-end justify-between">
                    <p className="font-semibold text-neutral-900">Ex-showroom price</p>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-neutral-900">{price}</p>
                      <p className="text-sm text-neutral-500">or {booking?.emi}</p>
                    </div>
                  </div>

                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-800"
                  >
                    Share on WhatsApp
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky price + CTA bar */}
        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-neutral-200 bg-white px-6 py-4">
          <div>
            <p className="flex items-center gap-1.5 font-semibold text-neutral-900">
              {price}
              <Info className="size-3.5 text-neutral-400" />
            </p>
            <p className="text-sm text-neutral-500">or {booking?.emi}</p>
          </div>
          <button className="rounded-full bg-[#D42A2A] px-10 py-4 text-base font-semibold text-white shadow-sm shadow-red-900/10 transition-colors hover:bg-[#b91f1f]">
            Book for {booking?.bookingAmount}
          </button>
        </div>
      </div>

      <CityModal
        open={cityOpen}
        city={city}
        onSelect={(c) => {
          setCity(c)
          setCityOpen(false)
        }}
        onClose={() => setCityOpen(false)}
      />
    </div>
  )
}
