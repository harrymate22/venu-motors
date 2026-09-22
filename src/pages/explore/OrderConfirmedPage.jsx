import { useEffect } from "react"
import { Link, Navigate, useSearchParams } from "react-router-dom"
import { motion } from "motion/react"
import { CheckCircle2, Clock, Phone, Mail } from "lucide-react"
import { BIKES, inr } from "./bikes"

/**
 * Where the shop (shop.venumotors.in) sends buyers after checkout:
 *
 *   /order-confirmed?order=1042&status=paid&total=45000&model=thunder
 *                   &colour=Blue&battery=60V+32Ah&city=Hyderabad
 *
 * Only order facts travel in the URL — never the buyer's name, phone or email —
 * so the page is safe to land on from a shared link; it just echoes the order.
 *
 * `status` is "paid" once Razorpay confirms; anything else (a payment still
 * settling, bank transfer) gets the "awaiting payment" wording.
 */
const STATES = {
  paid: {
    icon: CheckCircle2,
    tone: "text-emerald-600",
    title: "Order confirmed.",
    tag: "Welcome to Venu",
    lead: "Your payment is through and your scooter is reserved. The receipt is on its way to your inbox.",
    amountLabel: "Amount paid",
  },
  processing: {
    icon: CheckCircle2,
    tone: "text-emerald-600",
    title: "Order placed.",
    tag: "Welcome to Venu",
    lead: "We have your order. The details are on their way to your inbox.",
    amountLabel: "Order total",
  },
  pending: {
    icon: Clock,
    tone: "text-amber-500",
    title: "Order received.",
    tag: "Payment pending",
    lead: "We're waiting for your payment to be confirmed. That usually takes a few minutes — we'll email you as soon as it's through.",
    amountLabel: "Amount due",
  },
}

/** Tells an installed Meta Pixel / Google tag about the sale, once per order. */
function useTrackPurchase({ order, total, model, paid }) {
  useEffect(() => {
    if (!paid || !order) return
    const key = `venu-purchase-${order}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, "1")
    } catch {
      // Storage blocked — tracking at most twice beats not tracking.
    }
    const value = Number(total) || 0
    window.fbq?.("track", "Purchase", { value, currency: "INR", content_ids: [model], content_type: "product" })
    window.gtag?.("event", "purchase", { transaction_id: String(order), value, currency: "INR" })
  }, [order, total, model, paid])
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-900">{value}</dd>
    </div>
  )
}

export default function OrderConfirmedPage() {
  const [params] = useSearchParams()
  const order = params.get("order")
  const status = params.get("status")
  const total = params.get("total")
  const colourName = params.get("colour")
  const battery = params.get("battery")
  const city = params.get("city")
  const bike = BIKES[params.get("model")]

  const state = STATES[status] ?? STATES.pending
  useTrackPurchase({ order, total, model: bike?.slug, paid: status === "paid" })

  if (!order) return <Navigate to="/" replace />

  const Icon = state.icon
  const colour = bike?.colours.find((c) => c.name === colourName)
  const photo =
    colour?.bg ?? bike?.variants.find((v) => v.colour === colourName)?.image ?? bike?.variants[0]?.image ?? bike?.image

  return (
    <div className="flex min-h-svh flex-col bg-[#F3F7F9]">
      <header className="p-5 lg:px-8">
        <Link to="/" className="select-none text-xl font-extrabold tracking-[0.18em] text-neutral-900">
          VENU<span className="font-medium text-neutral-500"> MOTORS</span>
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-4 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] lg:grid-cols-2"
        >
          {photo && (
            <div className="flex items-center justify-center bg-[#E7E9EC] p-6 lg:p-10">
              <img src={photo} alt={bike ? `${bike.name} ${colourName ?? ""}` : ""} className="max-h-72 w-full object-contain lg:max-h-[420px]" />
            </div>
          )}

          <div className="p-7 md:p-10">
            <Icon className={`size-9 ${state.tone}`} />
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              <span className="text-neutral-900">{state.title}</span>{" "}
              <span className="text-neutral-400">{state.tag}</span>
            </h1>
            <p className="mt-3 leading-relaxed text-neutral-600">{state.lead}</p>

            <dl className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
              <Row label="Order number" value={`#${order}`} />
              <Row label="Model" value={bike?.name} />
              <Row label="Colour" value={colourName} />
              <Row label="Battery" value={battery} />
              <Row label="Delivery city" value={city} />
              <Row label={state.amountLabel} value={Number(total) ? inr(Number(total)) : null} />
            </dl>

            <div className="mt-8 rounded-2xl bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-600">
              <p className="font-semibold text-neutral-900">What happens next</p>
              <p className="mt-1">
                Our team will call you on the number you gave at checkout to arrange delivery
                {city ? ` in ${city}` : ""}. Keep your order number handy.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <a href="mailto:ceo@venumotors.in" className="flex items-center gap-2 font-medium text-neutral-800 hover:underline">
                  <Mail className="size-4" /> ceo@venumotors.in
                </a>
                <a href="tel:+919133913975" className="flex items-center gap-2 font-medium text-neutral-800 hover:underline">
                  <Phone className="size-4" /> +91 91339 13975
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-full bg-neutral-900 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                Back to home
              </Link>
              {bike && (
                <Link
                  to={`/${bike.slug}`}
                  className="rounded-full px-7 py-3 text-sm font-semibold text-neutral-800 ring-1 ring-neutral-300 transition hover:ring-neutral-500"
                >
                  Explore the {bike.shortName}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
