"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {
        name: 'home',
        path: '/'
    },
    {
        name: 'services',
        path: '/services'
    },
    {
        name: 'resume',
        path: '/resume'
    },
    {
        name: 'work',
        path: '/work'
    },
    {
        name: 'contact',
        path: '/contact'
    },
]

const Nav = () => {
    const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="flex gap-8">{links.map((link, index) => {
        return <Link prefetch={false} key={index} href={link.path} aria-current={link.path === pathname ? "page" : undefined} className={`${link.path === pathname ? "text-accent border-b-2 border-accent" : ""} capitalize font-medium hover:text-accent transition-all duration-300`}>{link.name}</Link>;
    })}</nav>
  )
}

export default Nav
