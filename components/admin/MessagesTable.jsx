"use client";
import { emailLink } from "@/lib/links";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeZone: "Asia/Gaza",
      }).format(new Date(value))
    : "—";
export default function MessagesTable({ messages, csrf }) {
  const dialog = useRef(null),
    headingId = useId(),
    router = useRouter();
  const [selected, setSelected] = useState(null),
    [statuses, setStatuses] = useState({}),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function update(id, status) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatuses((previous) => ({ ...previous, [id]: status }));
      router.refresh();
    } catch (error) {
      setError(error.message || "Could not update the message.");
    } finally {
      setBusy(false);
    }
  }
  function open(message) {
    setSelected(message);
    setError("");
    dialog.current.showModal();
  }
  return (
    <>
      <p role="alert" className="admin-error">
        {error}
      </p>
      <div
        className="admin-table-wrap"
        role="region"
        aria-label="Contact messages"
        tabIndex={0}
      >
        <table className="admin-table">
          <caption className="sr-only">Contact form submissions</caption>
          <thead>
            <tr>
              <th scope="col">Sender</th>
              <th scope="col">Contact</th>
              <th scope="col">Service & message</th>
              <th scope="col">Received</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>
                  <strong>
                    {`${message.firstName} ${message.lastName}`.trim()}
                  </strong>
                </td>
                <td>
                  <a href={emailLink(message.email)}>{message.email}</a>
                  <span>{message.phone || "—"}</span>
                </td>
                <td>
                  <strong>{message.serviceLabel || "General enquiry"}</strong>
                  <p className="admin-message-preview">{message.message}</p>
                </td>
                <td>{formatDate(message.createdAt)}</td>
                <td>
                  <span
                    className={`admin-status admin-status-${statuses[message.id] || message.status}`}
                  >
                    {statuses[message.id] || message.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-icon-button"
                    onClick={() => open(message)}
                    aria-label={`Open message from ${message.firstName}`}
                  >
                    <ArrowUpRight size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && (
          <div className="admin-empty">
            <h2>No messages here.</h2>
            <p>New enquiries will appear in this table.</p>
          </div>
        )}
      </div>
      <dialog ref={dialog} className="admin-dialog" aria-labelledby={headingId}>
        {selected && (
          <>
            <div className="admin-dialog-heading">
              <div>
                <p className="admin-eyebrow">CONTACT MESSAGE</p>
                <h2 id={headingId}>
                  {`${selected.firstName} ${selected.lastName}`.trim()}
                </h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                aria-label="Close message"
                onClick={() => dialog.current.close()}
              >
                <X size={22} />
              </button>
            </div>
            <dl className="admin-message-details">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={emailLink(selected.email)}>{selected.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{selected.phone || "—"}</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>{selected.serviceLabel || "General enquiry"}</dd>
              </div>
              <div>
                <dt>Received</dt>
                <dd>{formatDate(selected.createdAt)}</dd>
              </div>
            </dl>
            <p className="admin-message-body">{selected.message}</p>
            <div className="admin-dialog-footer">
              <label htmlFor={`${headingId}-status`}>Status</label>
              <select
                id={`${headingId}-status`}
                className="admin-input"
                value={statuses[selected.id] || selected.status}
                disabled={busy}
                onChange={(event) => update(selected.id, event.target.value)}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
              <a
                href={emailLink(selected.email)}
                className="admin-button admin-button-primary"
              >
                Reply by email
                <ArrowUpRight size={16} />
              </a>
            </div>
            <p role="alert" className="admin-error">
              {error}
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
