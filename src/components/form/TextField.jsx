import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { fieldSurface, fieldFocus, fieldFocusWithin, fieldLabel } from "./field-styles"

/**
 * Labelled text input, reusable across forms.
 *
 * `prefix` renders a fixed adornment inside the field (e.g. "+91"). When it's
 * set the shell carries the surface and focus ring, and the inner input goes
 * transparent — otherwise the two would draw competing rings.
 *
 * `digitsOnly` strips non-digits as the user types and caps the length, so a
 * phone or pincode can never hold a malformed value in the first place.
 *
 * @param {{ id: string, label: string, value: string,
 *   onChange: (value: string) => void, prefix?: string,
 *   digitsOnly?: number, className?: string }} props
 */
export default function TextField({
  id,
  label,
  value,
  onChange,
  prefix,
  digitsOnly,
  className,
  ...props
}) {
  const handleChange = (e) => {
    const next = digitsOnly
      ? e.target.value.replace(/\D/g, "").slice(0, digitsOnly)
      : e.target.value
    onChange(next)
  }

  const input = (
    <Input
      id={id}
      value={value}
      onChange={handleChange}
      inputMode={digitsOnly ? "numeric" : undefined}
      className={
        prefix
          ? "h-full border-0 bg-transparent px-3 text-base shadow-none ring-0 focus-visible:ring-0 md:text-base"
          : cn(fieldSurface, fieldFocus, "md:text-base", className)
      }
      {...props}
    />
  )

  return (
    <div>
      <Label htmlFor={id} className={fieldLabel}>
        {label}
      </Label>

      {prefix ? (
        <div className={cn(fieldSurface, fieldFocusWithin, "flex items-center px-0 pl-4", className)}>
          <span className="shrink-0 text-neutral-500">{prefix}</span>
          {input}
        </div>
      ) : (
        input
      )}
    </div>
  )
}
