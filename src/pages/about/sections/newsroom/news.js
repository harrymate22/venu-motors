/**
 * Press coverage shown in the About page Newsroom section.
 *
 * `logo` is the publication's mark, not a story photo — it sits contained on a
 * white tile, so a square logo stays whole instead of being cropped.
 *
 * `year` is optional and only set where the article states a date. The Weekend
 * Leader piece is dated 03-May-2022 (Vol 13, Issue 18); the Icons of Indian
 * Business article carries no visible publication date, so it shows the outlet
 * alone rather than a guessed year — add one here if you can confirm it.
 *
 * The "Read More" link appears only once this list reaches four entries.
 *
 * @typedef {Object} NewsItem
 * @property {string}  id
 * @property {string}  title
 * @property {string}  source   Publication name
 * @property {string} [year]
 * @property {string}  href     External article URL
 * @property {string}  logo
 */

/** @type {NewsItem[]} */
export const NEWS = [
  {
    id: "icons-of-indian-business",
    title:
      "Venu Motors rising as one of the top players in the Indian Electric Vehicles market",
    source: "Icons of Indian Business",
    href: "https://iconsofindianbusiness.com/article/venu-motors-rising-as-one-of-the-top-players-in-the-indian-electric-vehicles-market",
    logo: "/about-us/newspost1.png",
  },
  {
    id: "the-weekend-leader",
    title:
      "Former child loom worker builds electric scooter brand, rakes in Rs 6 crore in less than a year",
    source: "The Weekend Leader",
    year: "2022",
    href: "https://www.theweekendleader.com/Success/3077/electric-vibes.html",
    logo: "/about-us/newspost2.png",
  },
]
