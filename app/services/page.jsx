import { BsArrowDownRight } from "react-icons/bs"
import Link from "next/link"
import { services } from "@/data/profile"
import StructuredData from "@/components/StructuredData"
import { pageMetadata, siteUrl } from "@/lib/seo"
export const metadata = pageMetadata("Laravel & Full-Stack Development Services", "Laravel backend development, full-stack Next.js applications, payment and API integrations, and ongoing product support by Majed Ziara. Available remotely.", "/services")

function Services() {
  return (
    <section className='min-h-[80vh] flex flex-col justify-center py-12 lg:py-0'>
      <div className="container mx-auto">
        <h1 className="h2 mb-10">Development services</h1>
        <StructuredData data={{
          "@context": "https://schema.org", "@type": "ItemList",
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem", position: index + 1,
            item: { "@type": "Service", name: service.title, description: service.description,
              url: `${siteUrl}/services`, provider: { "@id": `${siteUrl}/#person` } },
          })),
        }} />
        <div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16"
        >
          {services.map((service, index)=> {
            return <div key={index} className="flex-1 flex flex-col justify-center gap-6 group">
              {/* top */}
              <div className="w-full flex justify-between items-center">
                <div aria-hidden="true" className="text-5xl font-extrabold text-outline text-transparent transition-all duration-500">{service.num}</div>
                <Link prefetch={false} href="/contact" aria-label={`Discuss ${service.title}`}
                className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                ><BsArrowDownRight aria-hidden="true" className="text-primary text-3xl" /></Link>
              </div>
              {/* title */}
              <h2 className="text-[30px] sm:text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">{service.title}</h2>
              {/* description */}
              <p className="text-white/60">{service.description}</p>
              {/* border */}
              <div className="border-b border-white/20 w-full"></div>
            </div>
          })}
        </div>
      </div>
    </section>
  )
}

export default Services
