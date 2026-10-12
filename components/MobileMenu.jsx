"use client";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function MobileMenu({ open, onOpenChange, onCloseFocus, navigation, profileName }) {
  const links = navigation.links;
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent id="mobile-navigation" className="flex flex-col overflow-y-auto px-6 pb-8"
        onCloseAutoFocus={(event) => { event.preventDefault(); onCloseFocus(); }}>
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SheetDescription className="sr-only">Explore {profileName}’s portfolio.</SheetDescription>
        <Link prefetch={false} href="/" onClick={() => onOpenChange(false)} className="mt-20 mb-8 text-center text-4xl font-semibold">
          {navigation.logoText}<span className="text-accent">{navigation.logoAccent}</span>
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
