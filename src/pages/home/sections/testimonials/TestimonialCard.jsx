import { Play } from "lucide-react"

export default function TestimonialCard({ testimonial, onOpen }) {
  const { image, name, location, quote } = testimonial

  return (
    <figure className="flex h-full flex-col items-center rounded-2xl border border-black/[0.06] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onOpen(testimonial)}
        aria-label={`Play ${name}'s testimonial`}
        className="group relative rounded-full"
      >
        <span className="block size-28 overflow-hidden rounded-full ring-4 ring-emerald-50">
          <img
            src={image}
            alt={name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </span>
        {/* Play affordance */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
        </span>
      </button>

      <blockquote className="mt-6 text-sm leading-relaxed text-neutral-600">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="mt-5 h-0.5 w-8 rounded-full bg-emerald-500" />

      <figcaption className="mt-4">
        <p className="font-semibold text-neutral-900">{name}</p>
        <p className="text-sm text-neutral-500">{location}</p>
      </figcaption>
    </figure>
  )
}
