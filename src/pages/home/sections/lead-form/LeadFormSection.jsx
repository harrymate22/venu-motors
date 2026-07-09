import { useState } from "react"
import { LocateFixed, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const MODELS = ["Thunder", "S1 Pro"]

const inputClass =
  "w-full rounded-xl bg-neutral-100 px-4 py-3.5 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:ring-2 focus:ring-emerald-500/40"

export default function LeadFormSection() {
  const [form, setForm] = useState({ name: "", phone: "", pin: "", model: "" })
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const isValid =
    form.name.trim() && form.phone.trim().length >= 10 && form.pin.trim() && form.model

  const onSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
  }

  return (
    <section className="bg-[#F3F7F9] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)]">
          {/* Form */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl">
              Check out the offers you need
            </h2>

            {submitted ? (
              <div className="mt-8 flex items-start gap-3 rounded-2xl bg-emerald-50 p-6 text-emerald-800">
                <Check className="mt-0.5 size-5 shrink-0" />
                <p className="text-sm">
                  Thanks, {form.name.split(" ")[0]}! Our team will reach out to you
                  shortly with the best offers on the Venu {form.model}.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <input
                  className={inputClass}
                  placeholder="Name *"
                  value={form.name}
                  onChange={set("name")}
                  aria-label="Name"
                />

                <div className="flex items-center rounded-xl bg-neutral-100 pl-4 transition focus-within:ring-2 focus-within:ring-emerald-500/40">
                  <span className="text-neutral-500">+91</span>
                  <input
                    className="w-full bg-transparent px-3 py-3.5 text-neutral-900 placeholder:text-neutral-400 outline-none"
                    placeholder="Phone number *"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={set("phone")}
                    aria-label="Phone number"
                  />
                </div>

                <div className="relative">
                  <input
                    className={cn(inputClass, "pr-11")}
                    placeholder="Enter Pin Code or Area *"
                    value={form.pin}
                    onChange={set("pin")}
                    aria-label="Pin code or area"
                  />
                  <LocateFixed className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                  <span className="text-sm font-medium text-neutral-900">
                    Pick your model *
                  </span>
                  {MODELS.map((model) => (
                    <label
                      key={model}
                      className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700"
                    >
                      <input
                        type="radio"
                        name="model"
                        value={model}
                        checked={form.model === model}
                        onChange={set("model")}
                        className="size-4 accent-emerald-600"
                      />
                      {model}
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className="w-full rounded-full bg-neutral-900 py-3.5 font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
                >
                  Submit
                </button>

                <p className="text-center text-xs leading-relaxed text-neutral-400">
                  By clicking &lsquo;Submit&rsquo; you agree to our{" "}
                  <a href="#" className="font-medium text-neutral-600 underline">
                    Privacy Policy
                  </a>{" "}
                  and allow Venu Motors and our partners to contact you.
                </p>
              </form>
            )}
          </div>

          {/* Image */}
          <div className="relative hidden bg-white lg:block">
            <img
              src="/Home-page/connectwithus.png"
              alt="Venu Thunder"
              className="absolute inset-0 size-full origin-top scale-[1.4] object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
