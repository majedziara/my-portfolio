import Link from 'next/link'
import {FaGithub, FaLinkedinIn, FaTwitter, FaYoutube} from 'react-icons/fa'

const socials = [
  {icon: <FaGithub />, path: 'https://github.com/majedmaher'},
  {icon: <FaLinkedinIn />, path: 'https://www.linkedin.com/in/majed-maher/'},
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