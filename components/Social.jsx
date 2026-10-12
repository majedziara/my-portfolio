import Link from 'next/link'
import {FaGithub, FaLinkedinIn} from 'react-icons/fa'


function Social({containerStyles, iconStyles, profile}) {
  const socials = [
    {icon: <FaGithub aria-hidden="true" />, path: profile.github, label: 'GitHub'},
    {icon: <FaLinkedinIn aria-hidden="true" />, path: profile.linkedin, label: 'LinkedIn'},
  ];
  return (
    <div className={containerStyles}>
      {socials.map((social, index) => {
        return <Link key={index} href={social.path} className={iconStyles} target='_blank' rel="noopener noreferrer" aria-label={`${social.label} (opens in a new tab)`}>
          {social.icon}
        </Link>
      })}
    </div>
  )
}

export default Social
