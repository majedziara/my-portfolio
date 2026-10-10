"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CiMenuFries } from "react-icons/ci";

// Download the dialog and focus-management code only when the menu is opened.
const MobileMenu = dynamic(() => import("./MobileMenu"), {
  loading: () => <p role="status" className="sr-only">Loading navigation…</p>,
});
export default function MobileNav() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  return (
    <>
      <button ref={triggerRef} type="button" aria-label="Open navigation menu" aria-haspopup="dialog"
        aria-expanded={open} aria-controls={mounted ? "mobile-navigation" : undefined}
        onClick={() => { setMounted(true); setOpen(true); }}
        className="flex min-h-11 min-w-11 justify-center items-center cursor-pointer">
        <CiMenuFries aria-hidden="true" className="text-[32px] text-accent" />
      </button>
      {mounted && <MobileMenu open={open} onOpenChange={setOpen} onCloseFocus={() => triggerRef.current?.focus()} />}
    </>
  );
}
