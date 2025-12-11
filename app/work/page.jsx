'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css'
import WorkSliderBtns from "@/components/WorkSliderBtns";
const projects = [
  {
    num: "01",
    category: "backend",
    title: "Enjoy Games",
    description:
      "Enjoy Games is a digital platform specialized in selling and delivering game credits, in-game top-ups, and electronic codes quickly and reliably. The system provides a smooth purchasing experience with intelligent order processing, automatic code distribution, real-time notifications, and full tracking for every step of the order. Customers can complete their purchases without creating an account, and each product supports a specific delivery method—whether through direct code delivery, in-game ID top-up, multi-ID top-up, or account-login–based charging. Every transaction is documented with proof of delivery, ensuring full transparency and trust. Enjoy Games combines speed, accuracy, and convenience to offer gamers a reliable and effortless way to get their digital products.",
    stack: [{ name: "Laravel" }],
    image: "/assets/work/thumb1.png",
    live: "",
    github: "https://github.com/majedmaher/smart_digital_shop",
  },
  {
    num: "02",
    category: "fullstack",
    title: "Digo",
    description:
      "Digo is a technology company specializing in building modern software solutions and high-quality digital platforms. The company develops complete systems that include web applications, mobile apps, e-commerce platforms, administrative systems, payment integrations, and third-party API connections — all with a strong focus on security, performance, and user experience. With a skilled technical team, Digo transforms ideas into fully functional digital products, delivering fast, reliable, and scalable solutions tailored to different business sectors. The company’s mission is to help clients achieve real digital transformation through practical, efficient, and future-ready technologies.",
    stack: [{ name: "Laravel" },{name: 'Html 5'},{ name: "Css 3" },{name: 'Javascript'},{ name: "JQuery" },{name: 'AJAX'}],
    image: "/assets/work/image_original.jpg",
    live: "",
    github: "https://github.com/majedmaher/digo",
  },
  {
    num: "03",
    category: "mobile",
    title: "Digo",
    description:
      "Digo is a technology company specializing in building modern software solutions and high-quality digital platforms. The company develops complete systems that include web applications, mobile apps, e-commerce platforms, administrative systems, payment integrations, and third-party API connections — all with a strong focus on security, performance, and user experience. With a skilled technical team, Digo transforms ideas into fully functional digital products, delivering fast, reliable, and scalable solutions tailored to different business sectors. The company’s mission is to help clients achieve real digital transformation through practical, efficient, and future-ready technologies.",
    stack: [{ name: "Flutter" }],
    image: "/assets/work/thumb3.png",
    live: "",
    github: "https://github.com/majedmaher/digo_app_flutter",
  },
  {
    num: "04",
    category: "fullstack",
    title: "PGCC",
    description:
      "PGCC is a specialized center dedicated to developing digital skills, empowering communities, and fostering innovation in the fields of technology and modern education. Through a wide range of training programs, workshops, and practical projects, PGCC aims to build strong technical capabilities and create opportunities for youth, professionals, and organizations to grow in today’s fast-changing digital world. The center focuses on delivering high-quality learning experiences in areas such as programming, game development, digital tools, and technical problem-solving. PGCC also collaborates with institutions, experts, and industry partners to ensure that its programs reflect real-world needs and prepare participants for successful careers. Committed to excellence and continuous development, PGCC strives to become a leading hub for digital learning, creativity, and community engagement.",
    stack: [{ name: "Laravel" },{ name: "Livewire" },{name: 'Html 5'},{ name: "Css 3" },{name: 'Javascript'}],
    image: "/assets/work/thumb1.png",
    live: "",
    github: "https://github.com/majedmaher/pgcc-app",
  },
  {
    num: "05",
    category: "fullstack",
    title: "Najiz",
    description:
      "Najiz is the unified digital platform of the Saudi Ministry of Justice, designed to provide fast, accessible, and fully digital judicial and legal services. Through Najiz, individuals, businesses, and governmental entities can access a wide range of services—such as issuing powers of attorney, reviewing cases, verifying documents, executing judgments, and managing contracts—without the need to visit judicial offices. The platform aims to enhance transparency, improve service quality, and support the digital transformation vision of the Kingdom. By integrating advanced technologies and streamlining legal processes, Najiz enables users to complete their justice-related transactions efficiently and securely.",
    stack: [{ name: "Laravel" },{ name: "Livewire" },{name: 'Html 5'},{ name: "Css 3" },{name: 'Javascript'}],
    image: "/assets/work/thumb2.png",
    live: "",
    github: "https://github.com/majedmaher/najiz-law-app",
  },
];

function Works() {
  const [project, setProject] = useState(projects[0])

  const handleSlideChange = (swiper)=>{
    const currentIndex = swiper.activeIndex;
    setProject(projects[currentIndex]); 
  }

  return <motion.section 
  initial={{opacity:0}} 
  animate={{opacity:1, transition:{delay:2.4, duration:0.4, ease:'easeIn'}}}
  className="min-h-[80vh] flex flex-col justify-center py-12 lg:px-0"
  >
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row lg:gap-[30px]">
        <div className="w-full lg:w-[50%] lg:h-[460px] flex flex-col lg:justify-between order-2 lg:order-1">
          <div className="flex flex-col gap-[30px] h-[50%]">
            <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
              {project.num}
            </div>
            <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
              {project.category} project
            </h2>
            <p className="text-white/60">{project.description}</p>
            <ul className="flex flex-wrap gap-4">
              {project.stack.map((item, index)=> {
                return <li key={index} className="text-xl text-accent">
                  {item.name}
                  {index !== project.stack.length - 1 && ','}
                </li>
              })}
            </ul>
            <div className="border border-white/20"></div>
            <div className="flex items-center gap-4">
              {project.live && <Link href={project.live} target="_blank">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className='w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group hover:cursor-pointer'>
                      <BsArrowUpRight className="text-white text-3xl group-hover:text-accent" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Live Project
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>}
              {project.github && <Link href={project.github} target="_blank">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className='w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group hover:cursor-pointer'>
                      <BsGithub className="text-white text-3xl group-hover:text-accent" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Github Repository
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[50%] order-1 lg:order-2">
          <Swiper
          spaceBetween={30}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          className='lg:[520px] mb-12'
          >
            {projects.map((item, index)=> {
              return <SwiperSlide key={index} className='w-full'>
                <div className="h-[460px] relative group flex justify-center items-center bg-pink-50/20">
                  <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10"></div>
                  <div className="relative w-full h-full">
                    <Image src={item.image} fill className="object-cover" alt={item.description} />
                  </div>
                </div>
              </SwiperSlide>
            })}
            <WorkSliderBtns containerStyles='flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] lg:bottom-0 z-20 w-full justify-between lg:w-max lg:justify-none' btnStyles='bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all cursor-pointer' />
          </Swiper>
        </div>
      </div>
    </div>
  </motion.section>;
}

export default Works;
