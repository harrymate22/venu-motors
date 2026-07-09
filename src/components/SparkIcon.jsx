import { cn } from "@/lib/utils"

const mask = {
  WebkitMaskImage: "url(/icons/spark_icon.svg)",
  maskImage: "url(/icons/spark_icon.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
}

/** Brand spark (4-point) rendered from /icons/spark_icon.svg, tinted red. */
export default function SparkIcon({ className }) {
  return (
    <span aria-hidden className={cn("inline-block shrink-0 bg-red-500", className)} style={mask} />
  )
}
