'use client'
import { FaGitAlt, FaJs, FaPhp, FaReact } from 'react-icons/fa'
import { SiDocker, SiLaravel, SiMysql, SiNextdotjs, SiPostgresql, SiRedis, SiTailwindcss, SiTypescript } from 'react-icons/si'
import {motion} from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { education as educationItems, experience as experienceItems, profile } from '@/data/profile'

const about = {
  title: 'About me',
  description: profile.summary,
  info: [
    {
      fieldName: 'Name',
      fieldValue: profile.name
    },
    {
      fieldName: 'Phone',
      fieldValue: profile.phone
    },
    {
      fieldName: 'Experience',
      fieldValue: profile.experience
    },
    {
      fieldName: 'Nationality',
      fieldValue: 'Palestinian'
    },
    {
      fieldName: 'Email',
      fieldValue: profile.email
    },
    {
      fieldName: 'Languages',
      fieldValue: 'Arabic, English, Russian'
    },
  ]
}

const experience = {
  icon: '/assets/resume/badge.svg',
  title: 'My Experience',
  description: "My work centers on Laravel backends and full-stack products, from requirements and data modeling through deployment, integrations, and production support. I paused professional work from November 2023 to June 2025 because of war conditions in Gaza and returned in July 2025.",
  items: experienceItems
}

const education = {
  icon: '/assets/resume/cap.svg',
  title: 'My Education',
  description: "An Information Technology foundation supported by continued learning in software engineering, languages, and practical AI literacy.",
  items: educationItems
}

const skills = {
  title: 'My Skills',
  description: 'My strongest skills are Laravel backend engineering and full-stack product delivery. I use Next.js for modern interfaces and work comfortably with relational data, caching, version control, and production environments.',
  skillList: [
    {
      icon: <FaPhp />,
      name: 'PHP'
    },
    {
      icon: <SiLaravel />,
      name: 'Laravel'
    },
    {
      icon: <FaJs />,
      name: 'JavaScript'
    },
    {
      icon: <SiTypescript />,
      name: 'TypeScript'
    },
    {
      icon: <FaReact />,
      name: 'React'
    },
    {
      icon: <SiNextdotjs />,
      name: 'Next.js'
    },
    {
      icon: <SiTailwindcss />,
      name: 'Tailwind CSS'
    },
    {
      icon: <SiMysql />,
      name: 'MySQL'
    },
    {
      icon: <SiPostgresql />,
      name: 'PostgreSQL'
    },
    {
      icon: <SiRedis />,
      name: 'Redis'
    },
    {
      icon: <FaGitAlt />,
      name: 'Git & GitHub'
    },
    {
      icon: <SiDocker />,
      name: 'Docker fundamentals'
    },
  ]
}

function Resume() {
  return (
    <motion.div 
    initial={{opacity: 0}} 
    animate={{opacity: 1, transition:{delay: 2.4, duration: 0.4, ease: 'easeIn'}}}
    className='min-h-[80vh] flex items-center justify-center py-12 lg:py-0'
    >
      <div className="container mx-auto">
        <Tabs defaultValue='experience' className='flex flex-col lg:flex-row gap-[60px]'>
          <TabsList className='flex flex-col w-full max-w-[380px] mx-auto lg:mx-0 gap-6'>
            <TabsTrigger value='experience'>Experience</TabsTrigger>
            <TabsTrigger value='education'>Education</TabsTrigger>
            <TabsTrigger value='skills'>Skills</TabsTrigger>
            <TabsTrigger value='about-me'>About me</TabsTrigger>
          </TabsList>
          <div className='min-h-[70vh] w-full'>
            <TabsContent value='experience' className='w-full'>
              <div className="flex flex-col gap-[30px] text-center lg:text-left">
                <h3 className="text-4xl font-bold">{experience.title}</h3>
                <p className='max-w-[600px] text-white/60 mx-auto lg:mx-0'>{experience.description}</p>
                <ScrollArea className='h-[400px]'>
                  <ul className='grid grid-cols-1 lg:grid-cols-2 gap-[30px]'>
                    {experience.items.map((item, index)=> {
                      return <li key={index} className='bg-[#232329] min-h-[210px] py-6 px-8 rounded-xl flex flex-col justify-center items-center lg:items-start gap-2'>
                        <span className='text-accent'>{item.duration}</span>
                        <h3 className='text-xl max-w-[260px] min-h-[60px] text-center lg:text-left'>{item.position}</h3>
                        <div className='flex items-center gap-3'>
                          <motion.span initial={{opacity: 0}} animate={{opacity: 1, transition:{duration: 0.5, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse'}}} className='w-[6px] h-[6px] rounded-full bg-accent'></motion.span>
                          <p className='text-white/60'>{item.company}</p>
                        </div>
                        <p className='text-sm text-white/55 text-center lg:text-left mt-2'>{item.summary}</p>
                      </li>
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value='education' className='w-full'>
              <div className="flex flex-col gap-[30px] text-center lg:text-left">
                <h3 className="text-4xl font-bold">{education.title}</h3>
                <p className='max-w-[600px] text-white/60 mx-auto lg:mx-0'>{education.description}</p>
                <ScrollArea className='h-[400px]'>
                  <ul className='grid grid-cols-1 lg:grid-cols-2 gap-[30px]'>
                    {education.items.map((item, index)=> {
                      return <li key={index} className='bg-[#232329] min-h-[184px] py-6 px-8 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1'>
                        <span className='text-accent'>{item.duration}</span>
                        <h3 className='text-xl max-w-[260px] min-h-[60px] text-center lg:text-left'>{item.degree}</h3>
                        <div className='flex items-center gap-3'>
                          <motion.span initial={{opacity: 0}} animate={{opacity: 1, transition:{duration: 0.5, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse'}}} className='w-[6px] h-[6px] rounded-full bg-accent flex-none'></motion.span>
                          <p className='text-white/60'>{item.institution}</p>
                        </div>
                      </li>
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value='skills' className='w-full'>
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                  <h3 className="text-4xl font-bold">{skills.title}</h3>
                  <p className='max-w-[600px] text-white/60 mx-auto xl:mx-0'>{skills.description}</p>
                </div>
                <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:gap-[30px] gap-4'>
                  {skills.skillList.map((skill, index)=>{
                    return <li key={index}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger className='cursor-pointer w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group'>
                            <div className='text-6xl group-hover:text-accent transition-all duration-300'>{skill.icon}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='capitalize'>{skill.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  })}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value='about-me' className='w-full text-center lg:text-left'>
              <div className='flex flex-col gap-[30px]'>
                <h3 className='text-4xl font-bold'>{about.title}</h3>
                <p className='max-w-[600px] text-white/60 mx-auto lg:mx-0'>{about.description}</p>
                <ul className='grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto lg:mx-0'>
                  {about.info.map((item, index)=> {
                    return <li key={index} className='flex items-center justify-center lg:justify-start gap-4'>
                      <span className='text-white/60'>{item.fieldName}</span>
                      <span className='text-xl'>{item.fieldValue}</span>
                    </li>
                  })}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  )
}

export default Resume
