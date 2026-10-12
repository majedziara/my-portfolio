"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  Mail,
  Image as ImageIcon,
  LockKeyhole,
  LogOut,
  FilePenLine,
} from "lucide-react";
import { contentSections } from "@/lib/content-definition";
export default function DashboardShell({ children, csrf, brand }) {
  const pathname = usePathname();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/messages", label: "Messages", icon: Mail },
    ...contentSections.map((section) => ({
      href: `/admin/content/${section.key}`,
      label: section.label,
      icon: FilePenLine,
    })),
    { href: "/admin/media", label: "Media library", icon: ImageIcon },
    { href: "/admin/security", label: "Security", icon: LockKeyhole },
  ];
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": csrf },
      });
      if (response.ok || response.status === 401)
        window.location.replace("/admin/login");
      else {
        setError("Could not sign out. Try again.");
        setBusy(false);
      }
    } catch {
      setError("Could not connect. Try again.");
      setBusy(false);
    }
  }
  const navigation = (
    <nav aria-label="Dashboard navigation" className="admin-navigation">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          prefetch={false}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          {brand}
          <span>.</span>
        </Link>
        <p className="admin-eyebrow">PORTFOLIO STUDIO</p>
        {navigation}
        <div className="admin-sidebar-bottom">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-text-link"
          >
            View website
            <ArrowUpRight size={17} />
          </a>
          <button
            type="button"
            disabled={busy}
            onClick={logout}
            className="admin-text-link"
          >
            <LogOut size={17} />
            {busy ? "Signing out…" : "Sign out"}
          </button>
          <p role="alert" className="admin-error">
            {error}
          </p>
        </div>
      </aside>
      <header className="admin-mobile-bar">
        <span className="admin-brand">
          {brand}
          <span>.</span>
        </span>
        <details>
          <summary>Menu</summary>
          {navigation}
          <button
            type="button"
            className="admin-button"
            disabled={busy}
            onClick={logout}
          >
            Sign out
          </button>
        </details>
        <p role="alert" className="admin-error">
          {error}
        </p>
      </header>
      <main id="admin-main" className="admin-main">
        <header className="admin-topbar">
          <span>Website management</span>
          <a href="/" target="_blank" rel="noopener noreferrer">
            View site
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </header>
        {children}
      </main>
    </div>
  );
}
