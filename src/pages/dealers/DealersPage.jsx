import DealerFinder from "./sections/finder/DealerFinder"
import DealerCta from "./sections/cta/DealerCta"

/**
 * /locate-venu-dealer — where to go and see a Venu in person.
 *
 * Distinct from /dealership, which is the form for people who want to *open* a
 * showroom. This page is for buyers; DealerCta links the two.
 */
export default function DealersPage() {
  return (
    <main>
      <DealerFinder />
      <DealerCta />
    </main>
  )
}
