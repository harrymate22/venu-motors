/**
 * Hero carousel slides.
 *
 * Each slide is fully data-driven — add or reorder entries here and the
 * carousel, dots, and layouts update automatically. Optional fields simply
 * render nothing when omitted.
 *
 * @typedef {Object} HeroButton
 * @property {string} label
 * @property {"primary" | "dark"} variant
 *
 * @typedef {Object} HeroSpecs
 * @property {string} name           Product name shown above the spec row
 * @property {string[]} items        Short spec strings, divider-separated
 *
 * @typedef {Object} HeroSlide
 * @property {string}   id
 * @property {string}   image        Path under /public
 * @property {string}   alt
 * @property {"center" | "left"} [align]  Content alignment (default "center")
 * @property {string}   [eyebrow]    Small label above the title
 * @property {string[]} title        One entry per line
 * @property {string[]} [description] One entry per line
 * @property {HeroButton[]} buttons
 * @property {HeroSpecs} [specs]     Renders the bottom spec bar
 * @property {string}   [footnote]   Small print, bottom-right (e.g. "*T&C Apply")
 */

/** @type {HeroSlide[]} */
export const HERO_SLIDES = [
  {
    id: "e-fighter",
    image: "/Home-page/hero_banner.png",
    alt: "Venu E-Fighter electric scooter",
    eyebrow: "INTRODUCING",
    title: ["Venu E-Fighter"],
    description: [
      "Powered by a choice of Graphene or Lithium-ion battery.",
      "60-100 kms of range for every Indian.",
      "At an introductory pricing of ₹65,000.",
    ],
    buttons: [
      { label: "Buy Now", variant: "primary" },
      { label: "Explore More", variant: "dark" },
    ],
  },
  {
    id: "e-fighter-lithium",
    image: "/Home-page/hero_banner1.png",
    alt: "Venu E-Fighter Lithium-ion electric scooter",
    title: ["Venu E-Fighter Lithium-ion", "now at ₹82,000"],
    buttons: [{ label: "Explore More", variant: "dark" }],
    specs: {
      name: "Venu E-Fighter Lithium-ion",
      items: ["60-100 km Range", "Dual Disc Brakes", "Under 5 hrs Charge"],
    },
    footnote: "*T&C Apply",
  },
  {
    id: "insiders",
    image: "/Home-page/hero_banner2.png",
    alt: "Venu Insiders community group ride",
    align: "left",
    eyebrow: "VENU INSIDERS",
    title: ["Upgrade program now live across India.", "Built for our community."],
    description: [
      "You're not just an owner. You're part of India's biggest EV community",
      "over a million strong. This is our way of saying thank you.",
    ],
    buttons: [{ label: "Explore Benefit", variant: "dark" }],
  },
]
