import Photo from "@/components/Photo"
import Social from "@/components/Social"
import Stats from "@/components/Stats"
import { Button } from "@/components/ui/button"
import { FiDownload } from "react-icons/fi"
import { profile } from "@/data/profile"
import { pageMetadata, siteDescription, siteTitle } from "@/lib/seo"

export const metadata = pageMetadata(siteTitle, siteDescription)

function Home() {
  return (
    <section className="h-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col lg:flex-row items-center justify-between lg:pt-8 lg:pb-24">
          {/* text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="text-xl">{profile.title}</span>
            <h1 className="h1">Hello, I&apos;m <br /><span className="text-accent">{profile.name}</span></h1>
            <p className="max-w-[500px] mb-9 text-white/80">
              {profile.summary}
            </p>
            <div className="flex flex-col lg:flex-row items-center gap-8">
                <Button asChild variant="outline" size="lg" className="uppercase flex items-center gap-2">
                  <a href='/assets/majed-ziara-cv-2026.pdf' download>
                  <span>Download CV</span>
                  <FiDownload className="text-lg" aria-hidden="true" />
                  </a>
                </Button>
              <div className="mb-8 lg:mb-0">
                <Social containerStyles='flex gap-6' iconStyles='w-11 h-11 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary transition-colors duration-300' />
              </div>
            </div>
          </div>
          <div className='order-1 lg:order-2 mb-8 lg:mb-0'>
            <Photo />
          </div>
        </div>
      </div>
      <div>
        <Stats />
      </div>
    </section>
  )
}

export default Home
