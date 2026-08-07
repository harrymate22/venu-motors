/**
 * One place to change how every form control looks.
 *
 * These override the shadcn defaults (h-9, rounded-md, bordered) with the
 * softer, taller surface the site uses. Applied through `cn()` so tailwind-merge
 * resolves the conflicting utilities rather than letting both win.
 */
export const fieldSurface =
  "h-13 w-full rounded-xl border-0 bg-neutral-50 px-4 text-base text-[#2b2b2b] shadow-none ring-1 ring-black/[0.07] transition placeholder:text-neutral-400"

/** Focus treatment for a control that receives focus itself (input, trigger). */
export const fieldFocus =
  "focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-emerald-500/50"

/** Focus treatment for a shell wrapping the real control (e.g. a +91 prefix). */
export const fieldFocusWithin =
  "focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50"

export const fieldLabel = "mb-2 block text-sm font-medium text-[#2b2b2b]"
