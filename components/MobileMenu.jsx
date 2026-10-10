"use client";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { name: "home", path: "/" }, { name: "services", path: "/services" },
  { name: "resume", path: "/resume" }, { name: "work", path: "/work" },
  { name: "contact", path: "/contact" },
];
export default function MobileMenu({ open, onOpenChange, onCloseFocus }) {
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent id="mobile-navigation" className="flex flex-col overflow-y-auto px-6 pb-8"
        onCloseAutoFocus={(event) => { event.preventDefault(); onCloseFocus(); }}>
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SheetDescription className="sr-only">Explore Majed Ziara’s portfolio.</SheetDescription>
        <Link prefetch={false} href="/" onClick={() => onOpenChange(false)} className="mt-20 mb-8 text-center text-4xl font-semibold">
          Majed<span className="text-accent">.</span>
        </Link>
        <nav aria-label="Mobile navigation" className="flex flex-col items-center gap-4">
          {links.map((link) => (
            <Link prefetch={false} href={link.path} key={link.path} onClick={() => onOpenChange(false)}
              aria-current={link.path === pathname ? "page" : undefined}
              className={`${link.path === pathname ? "text-accent border-b-2 border-accent" : ""} min-h-11 flex items-center text-xl capitalize hover:text-accent transition-colors`}>
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
