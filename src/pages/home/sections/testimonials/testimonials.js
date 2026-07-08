/**
 * Community testimonials.
 *
 * Photos are real customer deliveries from /public/Testimonals. Add a `video`
 * URL to any entry and the lightbox will play it instead of showing the photo.
 *
 * @typedef {Object} Testimonial
 * @property {string}  id
 * @property {string}  image
 * @property {string}  name
 * @property {string}  location
 * @property {string}  quote
 * @property {string} [video]   Optional video URL — plays in the lightbox
 */

/** @type {Testimonial[]} */
export const TESTIMONIALS = [
  {
    id: "t1",
    image: "/Testimonals/review-1.jpg",
    name: "Rahul Verma",
    location: "Bengaluru",
    quote:
      "Switching to the Venu Thunder was the best decision — my daily commute now costs almost nothing.",
  },
  {
    id: "t2",
    image: "/Testimonals/review-2.jpg",
    name: "Priya Nair",
    location: "Kochi",
    quote:
      "It charges overnight at home and easily lasts my whole week. And the looks turn heads everywhere!",
  },
  {
    id: "t3",
    image: "/Testimonals/review-3.jpg",
    name: "Arjun Reddy",
    location: "Hyderabad",
    quote:
      "No registration hassle, no fuel bills. The Thunder just makes complete sense for the city.",
  },
  {
    id: "t4",
    image: "/Testimonals/review-4.jpg",
    name: "Sneha Kulkarni",
    location: "Pune",
    quote:
      "Smooth, silent and stylish. This is our family's first EV and we're absolutely hooked.",
  },
]
