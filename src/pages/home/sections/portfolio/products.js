/**
 * Portfolio products — Venu Thunder colour variants.
 *
 * Data sourced from venumotors.com/thunder (₹53,000 on-road, 65–70 km range,
 * 8 hr charge, colours Red / Blue / Grey), each with its own product shot.
 *
 * @typedef {Object} Product
 * @property {string}   id
 * @property {string}   model     e.g. "Venu Thunder"
 * @property {string}   variant   Colour name shown as the accent label
 * @property {string}   tagline
 * @property {string}   price     On-road price, e.g. "₹53,000"
 * @property {string[]} specs     Short spec chips
 * @property {string}   accent    Hex accent for the variant label + image tint
 * @property {string}   image
 */

/** @type {Product[]} */
export const PRODUCTS = [
  {
    id: "thunder-red",
    model: "Venu Thunder",
    slug: "thunder",
    variant: "Red",
    tagline: "Bold looks, effortless everyday ride",
    price: "₹53,000",
    specs: ["65–70 km range", "8 hr full charge"],
    accent: "#E11D48",
    image: "/Home-page/red_thunder_scooty.png",
  },
  {
    id: "thunder-blue",
    model: "Venu Thunder",
    slug: "thunder",
    variant: "Blue",
    tagline: "Built for Indian roads",
    price: "₹53,000",
    specs: ["65–70 km range", "8 hr full charge"],
    accent: "#2563EB",
    image: "/Home-page/blue_thunder_scooty.png",
  },
  {
    id: "thunder-grey",
    model: "Venu Thunder",
    slug: "thunder",
    variant: "Grey",
    tagline: "Ride green, every single day",
    price: "₹53,000",
    specs: ["65–70 km range", "8 hr full charge"],
    accent: "#6B7280",
    image: "/Home-page/grey_thunder_scooty.png",
  },
]
