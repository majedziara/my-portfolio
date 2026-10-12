"use client";
import { useState } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
export default function LoginForm() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [showPassword, setShowPassword] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Unable to sign in. Please try again.");
        setBusy(false);
        return;
      }
      window.location.replace("/admin");
    } catch {
      setError("Unable to connect. Please try again.");
      setBusy(false);
    }
  }
  return (
    <form
      method="post"
      action="/api/admin/login"
      onSubmit={submit}
      className="admin-login-form"
      aria-busy={busy}
    >
      <div>
        <p className="admin-eyebrow">OWNER ACCESS</p>
        <h2>Sign in.</h2>
        <p className="admin-muted">A private space to manage your website.</p>
      </div>
      <div>
        <label htmlFor="admin-username">Username</label>
        <input
          id="admin-username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={100}
          required
          className="admin-input"
        />
      </div>
      <div>
        <label htmlFor="admin-password">Password</label>
        <div className="admin-password-wrap">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            maxLength={128}
            required
            className="admin-input"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
            className="admin-eye"
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
      </div>
      <p role="alert" className="admin-error">
        {error}
      </p>
      <button className="admin-button admin-button-primary" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
        <ArrowUpRight size={20} aria-hidden="true" />
      </button>
      <p className="admin-login-note">Access is reserved for the site owner.</p>
    </form>
  );
}
