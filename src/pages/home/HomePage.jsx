import Hero from "./sections/hero/Hero"
import Portfolio from "./sections/portfolio/Portfolio"
import EmiSection from "./sections/emi/EmiSection"
import TestimonialsSection from "./sections/testimonials/TestimonialsSection"
import BlogSection from "./sections/blog/BlogSection"
import AboutSection from "./sections/about/AboutSection"
import LeadFormSection from "./sections/lead-form/LeadFormSection"
import FaqSection from "./sections/faq/FaqSection"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Portfolio />
      <EmiSection />
      <TestimonialsSection />
      <BlogSection />
      <AboutSection />
      <LeadFormSection />
      <FaqSection />
    </>
  )
}
