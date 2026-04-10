import Link from 'next/link'
import {FaGithub, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube} from 'react-icons/fa'

const socials = [
  {icon: <FaGithub />, path: 'https://github.com/majedziara/'},
  {icon: <FaLinkedinIn />, path: 'https://www.linkedin.com/in/majedziara/'},
  // {icon: <FaInstagram />, path: 'https://www.instagram.com/majedziyara/'},
  // {icon: <FaYoutube />, path: 'https://github.com/majedmaher'},
  // {icon: <FaTwitter />, path: 'https://github.com/majedmaher'},
]
function Social({containerStyles, iconStyles}) {
  return (
    <div className={containerStyles}>
      {socials.map((social, index) => {
        return <Link key={index} href={social.path} className={iconStyles} target='_blank'>
          {social.icon}
        </Link>
      })}
    </div>
  )
}

export default Social