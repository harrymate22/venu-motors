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
    id: "s1-pro",
    image: "/Home-page/hero_banner.png",
    alt: "Venu S1 Pro electric scooter",
    eyebrow: "INTRODUCING",
    title: ["Venu S1 Pro 5.2 kWh"],
    description: [
      "Powered by India's most advanced cell, 4680 Bharat Cell.",
      "320 kms of range for every Indian.",
      "At an introductory pricing of ₹1,29,999.",
    ],
    buttons: [
      { label: "Buy Now", variant: "primary" },
      { label: "Explore More", variant: "dark" },
    ],
  },
  {
    id: "roadster",
    image: "/Home-page/hero_banner1.png",
    alt: "Venu Roadster X+ electric motorcycle",
    title: ["India's longest Range Roadster", "now at ₹1,69,999"],
    buttons: [{ label: "Explore More", variant: "dark" }],
    specs: {
      name: "Venu Roadster X+ 9.1 kWh",
      items: ["Up to 500 Kms Range", "11 kWh Peak Power", "125 Kmph Top Speed"],
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
