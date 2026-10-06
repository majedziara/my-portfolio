import Link from 'next/link'
import {FaGithub, FaLinkedinIn} from 'react-icons/fa'
import { profile } from '@/data/profile'

const socials = [
  {icon: <FaGithub />, path: profile.github, label: 'GitHub'},
  {icon: <FaLinkedinIn />, path: profile.linkedin, label: 'LinkedIn'},
]
function Social({containerStyles, iconStyles}) {
  return (
    <div className={containerStyles}>
      {socials.map((social, index) => {
        return <Link key={index} href={social.path} className={iconStyles} target='_blank' aria-label={social.label}>
          {social.icon}
        </Link>
      })}
    </div>
  )
}

export default Social
