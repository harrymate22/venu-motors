import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { fieldSurface, fieldFocus, fieldLabel } from "./field-styles"

/**
 * Labelled dropdown built on the shadcn/Radix select, so the option list is a
 * styled popover rather than the OS control — same look on every browser.
 *
 * `size="lg"` is deliberate: SelectTrigger hard-codes heights behind
 * `data-[size=default]` / `data-[size=sm]`, and an unrecognised size means
 * neither variant matches and `fieldSurface`'s own height applies cleanly.
 *
 * @param {{ id: string, label: string, value: string,
 *   onChange: (value: string) => void, options: string[],
 *   placeholder?: string, className?: string }} props
 */
export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
}) {
  return (
    <div>
      <Label htmlFor={id} className={fieldLabel}>
        {label}
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          size="lg"
          className={cn(
            fieldSurface,
            fieldFocus,
            "justify-between data-[placeholder]:text-neutral-400 [&_svg]:text-neutral-500",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        {/* `popper` anchors the list under the trigger and matches its width */}
        <SelectContent position="popper" className="rounded-xl">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="rounded-lg py-2.5 text-base">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
