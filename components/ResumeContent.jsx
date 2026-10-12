import { FaCode, FaGitAlt, FaJs, FaPhp, FaReact } from 'react-icons/fa'
import { SiDocker, SiLaravel, SiMysql, SiNextdotjs, SiPostgresql, SiRedis, SiTailwindcss, SiTypescript } from 'react-icons/si'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import AnimatedPage from '@/components/AnimatedPage'
const icons = { php: FaPhp, laravel: SiLaravel, javascript: FaJs, typescript: SiTypescript, react: FaReact, nextjs: SiNextdotjs, tailwind: SiTailwindcss, mysql: SiMysql, postgresql: SiPostgresql, redis: SiRedis, git: FaGitAlt, docker: SiDocker, code: FaCode };
function Resume({ profile, resume }) {
  const about = { title: resume.aboutTitle, description: profile.summary, info: resume.aboutInfo.map(item => ({ fieldName: item.label, fieldValue: item.source === 'custom' ? item.value : profile[item.source] })) };
  const experience = { title: resume.experienceTitle, description: resume.experienceDescription, items: resume.experience };
  const education = { title: resume.educationTitle, description: resume.educationDescription, items: resume.education };
  const skills = { title: resume.skillsTitle, description: resume.skillsDescription, skillList: resume.skills.map(skill => { const Icon = icons[skill.icon] || FaCode; return { name: skill.name, icon: <Icon /> }; }) };
  return (
    <AnimatedPage className='min-h-[80vh] flex items-center justify-center py-12 lg:py-0'
    >
      <div className="container mx-auto">
        <Tabs orientation='vertical' defaultValue='experience' className='flex flex-col lg:flex-row gap-[60px]'>
          <TabsList aria-label='Resume sections' className='flex flex-col w-full max-w-[380px] mx-auto lg:mx-0 gap-6'>
            <TabsTrigger value='experience'>{resume.tabs.experience}</TabsTrigger>
            <TabsTrigger value='education'>{resume.tabs.education}</TabsTrigger>
            <TabsTrigger value='skills'>{resume.tabs.skills}</TabsTrigger>
            <TabsTrigger value='about-me'>{resume.tabs.about}</TabsTrigger>
          </TabsList>
          <div className='min-h-[70vh] w-full'>
            <TabsContent value='experience' className='w-full'>
              <div className="flex flex-col gap-[30px] text-center lg:text-left">
                <h2 className="text-4xl font-bold">{experience.title}</h2>
                <p className='max-w-[600px] text-white/60 mx-auto lg:mx-0'>{experience.description}</p>
                <div role='region' aria-label='Experience details' tabIndex={0} className='resume-scroll h-[400px] overflow-y-auto'>
                  <ul className='grid grid-cols-1 lg:grid-cols-2 gap-[30px]'>
                    {experience.items.map((item, index)=> {
                      return <li key={index} className='bg-[#232329] min-h-[210px] py-6 px-8 rounded-xl flex flex-col justify-center items-center lg:items-start gap-2'>
                        <span className='text-accent'>{item.duration}</span>
                        <h3 className='text-xl max-w-[260px] min-h-[60px] text-center lg:text-left'>{item.position}</h3>
                        <div className='flex items-center gap-3'>
                          <span aria-hidden="true" className='resume-dot w-[6px] h-[6px] rounded-full bg-accent'></span>
                          <p className='text-white/60'>{item.company}</p>
                        </div>
                        <p className='text-sm text-white/70 text-center lg:text-left mt-2'>{item.summary}</p>
                      </li>
                    })}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='education' className='w-full'>
              <div className="flex flex-col gap-[30px] text-center lg:text-left">
                <h2 className="text-4xl font-bold">{education.title}</h2>
                <p className='max-w-[600px] text-white/60 mx-auto lg:mx-0'>{education.description}</p>
                <div role='region' aria-label='Education details' tabIndex={0} className='resume-scroll h-[400px] overflow-y-auto'>
                  <ul className='grid grid-cols-1 lg:grid-cols-2 gap-[30px]'>
                    {education.items.map((item, index)=> {
                      return <li key={index} className='bg-[#232329] min-h-[184px] py-6 px-8 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1'>
                        <span className='text-accent'>{item.duration}</span>
                        <h3 className='text-xl max-w-[260px] min-h-[60px] text-center lg:text-left'>{item.degree}</h3>
                        <div className='flex items-center gap-3'>
                          <span aria-hidden="true" className='resume-dot w-[6px] h-[6px] rounded-full bg-accent flex-none'></span>
                          <p className='text-white/60'>{item.institution}</p>
                        </div>
                      </li>
                    })}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='skills' className='w-full'>
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                  <h2 className="text-4xl font-bold">{skills.title}</h2>
                  <p className='max-w-[600px] text-white/60 mx-auto xl:mx-0'>{skills.description}</p>
                </div>
                <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:gap-[30px] gap-4'>
                  {skills.skillList.map((skill, index)=>{
                    return <li key={index}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger aria-label={skill.name} className='cursor-pointer w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group'>
                            <div aria-hidden="true" className='text-6xl group-hover:text-accent transition-all duration-300'>{skill.icon}</div>
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
                <h2 className='text-4xl font-bold'>{about.title}</h2>
                <p className='max-w-[600px] text-white/60 mx-auto lg:mx-0'>{about.description}</p>
                <ul className='grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto lg:mx-0'>
                  {about.info.map((item, index)=> {
                    return <li key={index} className='flex flex-wrap items-center justify-center lg:justify-start gap-4 min-w-0'>
                      <span className='text-white/60'>{item.fieldName}</span>
                      <span className='text-base sm:text-xl break-all'>{item.fieldValue}</span>
                    </li>
                  })}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AnimatedPage>
  )
}

export default Resume
