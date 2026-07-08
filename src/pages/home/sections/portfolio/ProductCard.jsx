import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product }) {
  const { model, variant, tagline, price, specs, accent, image } = product
  const shortName = model.replace(/^Venu\s/, "") // "Thunder"

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white text-neutral-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={image}
          alt={`${model} ${variant}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-neutral-900 md:text-xl">
          {model}{" "}
          <span className="font-medium italic" style={{ color: accent }}>
            {variant}
          </span>
        </h3>
        <p className="mt-1 text-sm text-neutral-500">{tagline}</p>

        <div className="mt-5 border-t border-black/[0.08] pt-4">
          <p className="text-xs uppercase tracking-wide text-neutral-400">On-road price</p>
          <p className="mt-1 text-xl font-semibold text-neutral-900">
            {price}
            <span className="text-sm font-normal text-neutral-500"> onwards</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {specs.map((spec) => (
              <span
                key={spec}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Actions pinned to the bottom for equal-height cards */}
        <div className="mt-auto flex flex-col gap-3 pt-6">
          <Button className="group/btn h-11 w-full gap-2">
            Explore {shortName}
            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
          <Button variant="outline" className="group/btn h-11 w-full gap-2">
            Buy Now
            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
