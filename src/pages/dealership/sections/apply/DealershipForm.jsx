import { useState } from "react"
import { Check } from "lucide-react"
import TextField from "@/components/form/TextField"
import SelectField from "@/components/form/SelectField"

/**
 * Ranges start at the floor set in the requirements section — a 15 × 40 ft
 * showroom is 600 sq ft, and the minimum investment is ₹10 lakh. Keep these in
 * step with DealershipRequirements if either figure changes.
 */
const AREA_OPTIONS = [
  "600 – 1,000 Sq. Ft",
  "1,000 – 1,500 Sq. Ft",
  "1,500 – 2,500 Sq. Ft",
  "Above 2,500 Sq. Ft",
]

const INVESTMENT_OPTIONS = [
  "₹10 – 15 Lakhs",
  "₹15 – 25 Lakhs",
  "₹25 – 40 Lakhs",
  "Above ₹40 Lakhs",
]

const EMPTY = { name: "", phone: "", pincode: "", area: "", investment: "" }

export default function DealershipForm() {
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const isValid =
    form.name.trim().length > 1 &&
    form.phone.length === 10 &&
    form.pincode.length === 6 &&
    form.area &&
    form.investment

  const onSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
  }

  return (
    <section id="apply" className="scroll-mt-20 bg-[#F3F7F9] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] sm:p-10 md:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-[#2b2b2b] md:text-3xl">
            Fill your dealership application
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#2b2b2b]/65 md:text-base">
            Five details, about a minute. Our team reviews every application and gets in
            touch to talk through the next steps.
          </p>

          {submitted ? (
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-emerald-50 p-6 text-emerald-800">
              <Check className="mt-0.5 size-5 shrink-0" />
              <div className="text-sm leading-relaxed">
                <p className="font-semibold">
                  Thanks, {form.name.trim().split(" ")[0]} — your application is in.
                </p>
                <p className="mt-1 text-emerald-800/80">
                  We have your details for pincode {form.pincode}. Our dealership team will
                  call you on +91 {form.phone} to take it forward.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-8">
              {/* One grid for all five fields, so the two selects land under the
                  name/phone row rather than stretching the full width. */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <TextField
                  id="dealer-name"
                  label="Full name"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                />

                <TextField
                  id="dealer-phone"
                  label="Phone number"
                  placeholder="10-digit number"
                  prefix="+91"
                  digitsOnly={10}
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={set("phone")}
                />

                <TextField
                  id="dealer-pincode"
                  label="Pincode"
                  placeholder="6-digit pincode"
                  digitsOnly={6}
                  autoComplete="postal-code"
                  value={form.pincode}
                  onChange={set("pincode")}
                />

                <SelectField
                  id="dealer-area"
                  label="Area available"
                  value={form.area}
                  onChange={set("area")}
                  options={AREA_OPTIONS}
                />

                <SelectField
                  id="dealer-investment"
                  label="Investment"
                  value={form.investment}
                  onChange={set("investment")}
                  options={INVESTMENT_OPTIONS}
                />
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="h-13 rounded-sm bg-[#2b2b2b] px-12 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
                >
                  Submit
                </button>
                <p className="text-xs leading-relaxed text-[#2b2b2b]/50 sm:max-w-sm">
                  By submitting you allow Venu Motors to contact you about this
                  dealership enquiry.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
