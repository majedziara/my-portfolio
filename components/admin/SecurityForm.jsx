"use client";
import { useState } from "react";
export default function SecurityForm({ csrf }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("newPassword") !== form.get("confirmPassword")) {
      setError("New passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({
          currentPassword: form.get("currentPassword"),
          newPassword: form.get("newPassword"),
          newUsername: form.get("newUsername"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.replace("/admin/login");
    } catch (error) {
      setError(error.message || "Could not update credentials.");
      setBusy(false);
    }
  }
  return (
    <form
      method="post"
      action="/api/admin/security"
      onSubmit={submit}
      className="admin-security-form"
      aria-busy={busy}
    >
      <div>
        <label htmlFor="current-password">Current password</label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          className="admin-input"
          autoComplete="current-password"
          maxLength={128}
          required
        />
      </div>
      <div>
        <label htmlFor="new-username">
          New username <span className="admin-muted">· optional</span>
        </label>
        <input
          id="new-username"
          name="newUsername"
          className="admin-input"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={100}
          pattern="[A-Za-z0-9_.@-]{3,100}"
        />
        <p className="admin-field-hint">
          Leave blank to keep your current username.
        </p>
      </div>
      <div>
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          className="admin-input"
          autoComplete="new-password"
          minLength={16}
          maxLength={128}
          required
        />
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          className="admin-input"
          autoComplete="new-password"
          minLength={16}
          maxLength={128}
          required
        />
      </div>
      <p className="admin-muted">
        Use at least 16 characters. All sessions will end after this change;
        sign in again with your updated credentials.
      </p>
      <p role="alert" className="admin-error">
        {error}
      </p>
      <button className="admin-button admin-button-primary" disabled={busy}>
        {busy ? "Updating…" : "Update credentials"}
      </button>
    </form>
  );
}
