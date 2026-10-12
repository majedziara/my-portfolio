import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  FolderOpen,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";
import { requireAdminPage } from "@/lib/admin/auth";
import { getDatabase, getContentDocument } from "@/lib/content";
import { contentSections } from "@/lib/content-definition";
export const metadata = { title: "Overview" };
export default async function Overview() {
  await requireAdminPage();
  const db = await getDatabase();
  const [{ content, updatedAt }, newCount, totalCount] = await Promise.all([
    getContentDocument(),
    db
      .collection("contacts")
      .countDocuments({
        $or: [{ status: "new" }, { status: { $exists: false } }],
      }),
    db.collection("contacts").countDocuments(),
  ]);
  const cards = [
    {
      label: "New messages",
      value: newCount,
      detail: `${totalCount} total enquiries`,
      href: "/admin/messages",
      icon: Mail,
    },
    {
      label: "Projects",
      value: content.work.projects.length,
      detail: "Selected work on your website",
      href: "/admin/content/work",
      icon: FolderOpen,
    },
    {
      label: "Experience entries",
      value: content.resume.experience.length,
      detail: "Your professional timeline",
      href: "/admin/content/resume",
      icon: BriefcaseBusiness,
    },
  ];
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">YOUR WORKSPACE</p>
          <h1>Overview</h1>
          <p className="admin-muted">A little maintenance goes a long way.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-button"
        >
          View website
          <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="admin-stat-grid">
        {cards.map(({ icon: Icon, ...card }) => (
          <Link
            key={card.label}
            prefetch={false}
            href={card.href}
            className="admin-stat-card"
          >
            <div>
              <Icon size={20} aria-hidden="true" />
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <span>{card.detail}</span>
          </Link>
        ))}
      </div>
      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Make it yours.</h2>
          <span className="admin-muted">Website content</span>
        </div>
        <div className="admin-section-list">
          {contentSections.map((section, index) => (
            <Link
              prefetch={false}
              href={`/admin/content/${section.key}`}
              key={section.key}
            >
              <span className="admin-section-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{section.label}</h3>
                <p>{section.description}</p>
              </div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
      <p className="admin-update-time">
        <Clock3 size={15} aria-hidden="true" />
        Last content update:{" "}
        {new Intl.DateTimeFormat("en", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Gaza",
        }).format(updatedAt)}
      </p>
    </>
  );
}
