import AboutHero from "./sections/hero/AboutHero"
import AboutStory from "./sections/story/AboutStory"
import AboutLeadership from "./sections/leadership/AboutLeadership"
import AboutFacility from "./sections/facility/AboutFacility"
import AboutPeople from "./sections/people/AboutPeople"
import BlogSection from "@/pages/home/sections/blog/BlogSection"
import NewsroomSection from "./sections/newsroom/NewsroomSection"

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutLeadership />
      <AboutFacility />
      <AboutPeople />
      <BlogSection className="bg-white" />
      <NewsroomSection />
    </>
  )
}
