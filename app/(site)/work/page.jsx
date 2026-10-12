import Image from "next/image";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import WorkGallery from "@/components/WorkGallery";
import AnimatedPage from "@/components/AnimatedPage";
import StructuredData from "@/components/StructuredData";
import { getSiteContent } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const generateMetadata = () => pageMetadata("work");
export default async function Work() {
  const { work } = await getSiteContent();
  const projects = work.projects;
  return (
    <AnimatedPage as="section" className="py-6 pb-12">
      <div className="container mx-auto">
        <h1 className="h2 mb-6">{work.heading}</h1>
        <StructuredData data={{
          "@context": "https://schema.org", "@type": "ItemList",
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem", position: index + 1,
            item: { "@type": "CreativeWork", name: project.title, description: project.description,
              url: `${siteUrl}/work#project-${project.num}`, image: new URL(project.image, siteUrl).href,
              creator: { "@id": `${siteUrl}/#person` }, },
          })),
        }} />
        <WorkGallery count={projects.length}>
          {projects.map((project, index) => (
            <article id={`project-${project.num}`} key={project.num} aria-label={`${index + 1} of ${projects.length}: ${project.title}`}
              className="w-full shrink-0 snap-start flex flex-col lg:flex-row gap-8 p-1 pb-6">
              <div className="min-w-0 lg:w-1/2 flex flex-col gap-5 order-2 lg:order-1">
                <div aria-hidden="true" className="text-7xl leading-none font-extrabold text-transparent text-outline">{project.num}</div>
                <div>
                  <p className="text-accent uppercase tracking-[0.18em] text-sm mb-2">{project.category}</p>
                  <h2 className="text-[30px] sm:text-[38px] font-bold leading-tight">{project.title}</h2>
                  <p className="text-white/70 mt-1">{project.role}</p>
                </div>
                <p className="text-white/70 leading-relaxed">{project.description}</p>
                <ul aria-label="Technologies used" className="flex flex-wrap gap-x-4 gap-y-2">
                  {project.stack.map((item) => <li key={item} className="text-base text-accent">{item}</li>)}
                </ul>
                <div className="border-t border-white/20" />
                <div className="flex items-center gap-4">
                  {project.live && <ProjectLink href={project.live} label={`Visit ${project.title}`}><BsArrowUpRight aria-hidden="true" /></ProjectLink>}
                  {project.github && <ProjectLink href={project.github} label={`${project.title} GitHub repository`}><BsGithub aria-hidden="true" /></ProjectLink>}
                </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="aspect-[585/460] relative overflow-hidden rounded-md bg-white/5">
                  <Image src={project.image} unoptimized={project.image.includes("/thumb") || project.image.startsWith("/api/media/")} fill sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw" preload={index === 0} fetchPriority={index === 0 ? "high" : "auto"} className="object-cover" alt={`${project.title} project preview`} />
                </div>
              </div>
            </article>
          ))}
        </WorkGallery>
      </div>
    </AnimatedPage>
  );
}
function ProjectLink({ href, label, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} title={label}
    className="w-[62px] h-[62px] rounded-full bg-white/5 flex justify-center items-center text-3xl hover:text-accent">{children}</a>;
}
