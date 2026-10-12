import Link from "next/link";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import { requireAdminPage } from "@/lib/admin/auth";
import { getDatabase, getSiteContent } from "@/lib/content";
import MessagesTable from "@/components/admin/MessagesTable";
export const metadata = { title: "Messages" };
export default async function MessagesPage({ searchParams }) {
  const session = await requireAdminPage();
  const query = await searchParams;
  const status = ["new", "read", "archived"].includes(query.status)
    ? query.status
    : "";
  const search =
    typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const page = Math.max(1, Math.min(10000, parseInt(query.page, 10) || 1));
  const filter = {};
  if (status === "new")
    filter.$or = [{ status: "new" }, { status: { $exists: false } }];
  else if (status) filter.status = status;
  if (search)
    filter.$and = [
      {
        $or: ["firstName", "lastName", "email", "message", "phone"].map(
          (field) => ({
            [field]: {
              $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              $options: "i",
            },
          }),
        ),
      },
    ];
  const db = await getDatabase();
  const [rows, total, { contact }] = await Promise.all([
    db
      .collection("contacts")
      .find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * 20)
      .limit(20)
      .toArray(),
    db.collection("contacts").countDocuments(filter),
    getSiteContent(),
  ]);
  const messages = rows.map((row) => ({
    id: row._id.toHexString(),
    firstName: row.firstName || "",
    lastName: row.lastName || "",
    email: row.email || "",
    phone: row.phone || "",
    serviceLabel:
      contact.serviceOptions.find((option) => option.value === row.service)
        ?.label ||
      row.service ||
      "",
    message: row.message || "",
    status: ["new", "read", "archived"].includes(row.status)
      ? row.status
      : "new",
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
  }));
  const pages = Math.max(1, Math.ceil(total / 20));
  const pageUrl = (next) =>
    `/admin/messages?${new URLSearchParams({ q: search, status, page: String(next) })}`;
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">INBOX</p>
          <h1>Contact messages</h1>
          <p className="admin-muted">
            Read enquiries, follow up, and keep track of conversations.
          </p>
        </div>
        <span className="admin-count">{total} messages</span>
      </div>
      <form action="/admin/messages" className="admin-message-filters">
        <div>
          <label htmlFor="message-search" className="sr-only">
            Search messages
          </label>
          <input
            id="message-search"
            name="q"
            placeholder="Search name, email, or message"
            defaultValue={search}
            className="admin-input"
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="message-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="message-filter"
            name="status"
            defaultValue={status}
            className="admin-input"
          >
            <option value="">All messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button className="admin-button">
          <Search size={16} />
          Search
        </button>
      </form>
      <MessagesTable messages={messages} csrf={session.csrf} />
      <nav aria-label="Message pages" className="admin-pagination">
        {page > 1 ? (
          <Link href={pageUrl(page - 1)} className="admin-button">
            <ArrowLeft size={16} />
            Previous
          </Link>
        ) : (
          <span />
        )}
        <span>
          Page {page} of {pages}
        </span>
        {page < pages ? (
          <Link href={pageUrl(page + 1)} className="admin-button">
            Next
            <ArrowRight size={16} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
