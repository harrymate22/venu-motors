/**
 * Venu Motors showrooms, as they appear on Google Maps.
 *
 * `mapUrl` is each store's own Google share link, so "Get directions" opens the
 * real listing — with its hours, phone number, photos and reviews — rather than
 * a coordinate we'd have to keep in sync by hand.
 *
 * Addresses are reproduced from the listings, lightly normalised for casing and
 * spacing. Order follows the list the team supplied rather than being sorted,
 * so it stays easy to check a new entry against the source.
 *
 * @typedef {Object} Dealer
 * @property {string} id      Stable key, also the anchor if we ever link to one
 * @property {string} city    Shown as the card title, after the brand
 * @property {string} state   Drives the filter above the cards
 * @property {string} address Full postal address as listed
 * @property {string} mapUrl  Google Maps share link for this store
 */

/** @type {Dealer[]} */
export const DEALERS = [
  {
    id: "bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    // Listed on Google as "VENU MOTORS Electric Bike Showroom".
    address:
      "Ganesha Nilaya, 142, Hennur Bagalur Main Rd, Hennur Bande, Hennur Gardens, Bengaluru, Karnataka 560043",
    mapUrl: "https://share.google/zEmL1fnc2Zvs2ukIP",
  },
  {
    id: "dharmavaram",
    city: "Dharmavaram",
    state: "Andhra Pradesh",
    // The manufacturing town (see AboutFacility). Google lists this one without
    // a street address, so the card carries the listing's own description.
    address: "Two-wheeler dealer in Dharmavaram, Anantapur district, Andhra Pradesh",
    mapUrl: "https://share.google/opYkT6BxiTnj5AV4s",
  },
  {
    id: "anantapur",
    city: "Anantapur",
    state: "Andhra Pradesh",
    address: "MH7J+F5G, Rajahamsa Galaxy, Rudrampeta, Anantapur, Andhra Pradesh 515004",
    mapUrl: "https://share.google/LcqyE5A93kyK0UdhZ",
  },
  {
    id: "nellore",
    city: "Nellore",
    state: "Andhra Pradesh",
    address: "B.V. Nagar, Nellore, Andhra Pradesh 524004",
    mapUrl: "https://share.google/IlCzsHHgurXLXZ6GA",
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    address:
      "D, Balkampet Rd, near Yellamma Temple, Prashanth Colony, Balkampet, Hyderabad, Telangana 500016",
    mapUrl: "https://share.google/uiMhnitQMQLlvfrDU",
  },
  {
    id: "tirupati",
    city: "Tirupati",
    state: "Andhra Pradesh",
    address:
      "D. No. 1-67/2, beside CPI office, M.K. Naidu Colony, Jaya Nagar, Bairagipatteda, Tirupati, Andhra Pradesh 517503",
    mapUrl: "https://share.google/bA7EYJk6nkchxoCAv",
  },
]

/**
 * Filter options for the locator. Derived from `DEALERS` rather than typed out,
 * so a new showroom in a new state can never leave a stale filter behind — and
 * a state with no stores can never show an empty tab.
 *
 * Filtering is by state rather than by city: every store is in a different city,
 * so a city filter would only ever narrow six cards down to one.
 */
export const DEALER_FILTERS = [
  { id: "all", label: "All locations", count: DEALERS.length },
  ...[...new Set(DEALERS.map((dealer) => dealer.state))].map((state) => ({
    id: state,
    label: state,
    count: DEALERS.filter((dealer) => dealer.state === state).length,
  })),
]

/** The states we're in, read out in a sentence — "A, B and C". */
export const DEALER_STATES = (() => {
  const states = [...new Set(DEALERS.map((dealer) => dealer.state))]
  return states.length > 1 ? `${states.slice(0, -1).join(", ")} and ${states.at(-1)}` : states[0]
})()
