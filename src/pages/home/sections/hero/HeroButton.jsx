import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

/** Fixed 208 x 56 hero CTA. `primary` = white, `dark` = near-black. */
const VARIANTS = {
  primary: "bg-white text-[#181E22] hover:bg-white/90",
  dark: "bg-[#181E22] text-white hover:bg-[#181E22]/90",
}

export default function HeroButton({ label, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "group flex h-14 w-52 items-center justify-center gap-2 rounded-sm text-lg font-medium transition-colors",
        VARIANTS[variant]
      )}
      {...props}
    >
      {label}
      <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
    </button>
  )
}
