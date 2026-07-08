import { cn } from "@/lib/utils"

/** Pagination dots driven by the embla api lifted up from <Hero />. */
export default function HeroDots({ count, current, onSelect }) {
  return (
    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === current}
          className={cn(
            "size-2 rounded-full transition-all",
            i === current ? "bg-white" : "bg-white/40 hover:bg-white/60"
          )}
        />
      ))}
    </div>
  )
}
