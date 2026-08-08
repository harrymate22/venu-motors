/**
 * Shown while a lazily-loaded route chunk downloads. Holds a viewport of height
 * so the footer doesn't jump up and then back down as the page arrives.
 */
export default function RouteFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-white">
      <span
        role="status"
        aria-label="Loading"
        className="size-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900"
      />
    </div>
  )
}
