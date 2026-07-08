import { ArrowRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { carouselArrowClass } from "@/lib/carousel"
import { POSTS } from "./posts"

function PostCard({ post }) {
  return (
    <a href={post.href} className="group block">
      <div className="overflow-hidden rounded-2xl bg-neutral-200">
        <img
          src={post.image}
          alt={post.title}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 text-lg font-medium leading-snug text-neutral-900 transition-colors group-hover:text-neutral-600">
        {post.title}
      </h3>
    </a>
  )
}

export default function BlogSection() {
  return (
    <section className="bg-[#F3F7F9] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Carousel opts={{ align: "start" }}>
          {/* Header */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                Discover, Learn, and Ride with Venu
              </h2>
              <p className="mt-3 max-w-xl text-neutral-500">
                Your hub for stories, guides, and insights on electric mobility and the world of Venu.
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <CarouselPrevious className={carouselArrowClass} />
              <CarouselNext className={carouselArrowClass} />
            </div>
          </div>

          <CarouselContent className="mt-10">
            {POSTS.map((post) => (
              <CarouselItem key={post.id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <PostCard post={post} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
        >
          Read more
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  )
}
