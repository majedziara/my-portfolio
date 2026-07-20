'use client'

import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa"
import {motion} from 'framer-motion'
import ContactForm from "@/components/ContactForm"

const info = [
  {
    icon: <FaPhoneAlt />,
    title: 'Phone',
    description: '(+972) 595 634 627'
  },
  {
    icon: <FaEnvelope />,
    title: 'Emain',
    description: 'majedmaher200@gmail.com'
  },
  {
    icon: <FaMapMarkerAlt />,
    title: 'Address',
    description: 'Palestine, Gaza'
  },
]

function Contact() {
  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition:{delay: 2.4, duration: 0.4, ease: 'easeIn'}}} className="py-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-[30px]">
          {/* form */}
          <ContactForm />
          {/* <div className="order-2 lg:order-1 lg:w-[54%]">
            <form className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl">
              <h3 className="text-4xl text-accent">Let's work together</h3>
              <p className="text-white/60">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed ipsam dolore eum neque labore ullam ducimus qui voluptas ea assumenda vero illo iure nostrum at, necessitatibus quas earum dolor eaque.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input type='firstname' placeholder='First Name' />
                <Input type='lastname' placeholder='Last Name' />
                <Input type='email' placeholder='Email Address' />
                <Input type='phone' placeholder='Phone Number' />
              </div>
              
              <Select>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a service' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a service</SelectLabel>
                    <SelectItem value='web'>Web Development</SelectItem>
                    <SelectItem value='mobile'>Mobile Development</SelectItem>
                    <SelectItem value='design'>Graphic Design & Motion Graphic</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Textarea className='h-[200px]' placeholder='Type your message here.' />

              <Button size='md' className='max-w-40'>Send Message</Button> 
            </form>
          </div> */}
          {/* info */}
          <div className="flex-1 flex items-center lg:justify-end order-1 lg:order-2 mb-8 lg:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index)=> {
                return <li key={index} className="flex items-center gap-6">
                  <div className="w-[52px] h-[52px] lg:h-[72px] lg:w-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                    <div className="text-[28px]">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60">{item.title}</p>
                    <h3 className="text-xl">{item.description}</h3>
                  </div>
                </li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Contact