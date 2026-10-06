'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import WorkSliderBtns from "@/components/WorkSliderBtns";
import { projects } from "@/data/profile";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function Works() {
  const [project, setProject] = useState(projects[0]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 2.4, duration: 0.4, ease: "easeIn" } }}
      className="min-h-[80vh] flex flex-col justify-center py-12 lg:px-0"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-[30px]">
          <div className="w-full lg:w-[50%] lg:min-h-[520px] order-2 lg:order-1">
            <div className="flex flex-col gap-5">
              <div className="text-7xl leading-none font-extrabold text-transparent text-outline">{project.num}</div>
              <div>
                <p className="text-accent uppercase tracking-[0.18em] text-sm mb-2">{project.category}</p>
                <h2 className="text-[38px] font-bold leading-tight text-white">{project.title}</h2>
                <p className="text-white/55 mt-1">{project.role}</p>
              </div>
              <p className="text-white/70 leading-relaxed">{project.description}</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {project.stack.map((item) => <li key={item} className="text-base text-accent">{item}</li>)}
              </ul>
              <div className="border border-white/20" />
              <div className="flex items-center gap-4">
                {project.live && <ProjectLink href={project.live} label="View live project"><BsArrowUpRight className="text-white text-3xl group-hover:text-accent" /></ProjectLink>}
                {project.github && <ProjectLink href={project.github} label="View GitHub repository"><BsGithub className="text-white text-3xl group-hover:text-accent" /></ProjectLink>}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[50%] order-1 lg:order-2">
            <Swiper spaceBetween={30} slidesPerView={1} onSlideChange={(swiper) => setProject(projects[swiper.activeIndex])} className="mb-12">
              {projects.map((item) => (
                <SwiperSlide key={item.num} className="w-full">
                  <div className="h-[460px] relative group overflow-hidden bg-white/5">
                    <div className="absolute inset-0 bg-black/10 z-10" />
                    <Image src={item.image} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" alt={`${item.title} project preview`} />
                  </div>
                </SwiperSlide>
              ))}
              <WorkSliderBtns containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] lg:bottom-0 z-20 w-full justify-between lg:w-max lg:justify-none" btnStyles="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all cursor-pointer" />
            </Swiper>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ProjectLink({ href, label, children }) {
  return (
    <Link href={href} target="_blank" aria-label={label}>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger className="w-[62px] h-[62px] rounded-full bg-white/5 flex justify-center items-center group hover:cursor-pointer">{children}</TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
}

export default Works;
