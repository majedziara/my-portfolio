"use client";
export default function AdminError({ reset }) {
  return (
    <main id="admin-main" className="admin-empty">
      <h1>Workspace unavailable.</h1>
      <p>We could not load this page. Please try again.</p>
      <button type="button" className="admin-button" onClick={reset}>
        Try again
      </button>
      <a href="/admin/login" className="admin-text-link">
        Back to sign in
      </a>
    </main>
  );
}
