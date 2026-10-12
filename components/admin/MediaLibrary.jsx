"use client";
import Image from "next/image";
import { useState } from "react";
import { FileText, Upload, Copy, Trash2 } from "lucide-react";
export default function MediaLibrary({ initialFiles, csrf }) {
  const [files, setFiles] = useState(initialFiles),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function upload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setMessage("Choose a file under 4 MB.");
      return;
    }
    setBusy(true);
    setMessage("");
    const body = new FormData();
    body.append("file", file);
    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "X-CSRF-Token": csrf },
        body,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setFiles((previous) => [result.file, ...previous]);
      setMessage("File uploaded. Use its path in your content.");
    } catch (error) {
      setMessage(error.message || "Upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }
  async function remove(id) {
    if (
      !window.confirm(
        "Delete this file permanently? Files in use cannot be deleted.",
      )
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setFiles((previous) => previous.filter((file) => file.id !== id));
      setMessage("File deleted.");
    } catch (error) {
      setMessage(error.message || "Could not delete the file.");
    } finally {
      setBusy(false);
    }
  }
  async function copy(url) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("File path copied.");
    } catch {
      setMessage("Copy the file path from the field below the preview.");
    }
  }
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">ASSETS</p>
          <h1>Media library</h1>
          <p className="admin-muted">
            Images and CV files for your website. Up to 4 MB per file.
          </p>
        </div>
        <label className="admin-button admin-button-primary">
          <Upload size={17} />
          {busy ? "Working…" : "Upload file"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            onChange={upload}
            disabled={busy}
            className="sr-only"
          />
        </label>
      </div>
      <p role="status" className="admin-notice">
        {message}
      </p>
      <div className="admin-media-grid">
        {files.map((file) => (
          <article key={file.id} className="admin-media-card">
            <div className="admin-media-image">
              {file.type.startsWith("image/") ? (
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  sizes="(max-width: 600px) 90vw, 300px"
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <FileText
                  size={48}
                  className="text-accent"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="admin-media-body">
              <h2>{file.name}</h2>
              <p className="admin-muted">
                {(file.size / 1024).toFixed(0)} KB ·{" "}
                {file.type === "application/pdf" ? "PDF" : "WebP"}
              </p>
              <input
                readOnly
                value={file.url}
                className="admin-input"
                aria-label={`Path for ${file.name}`}
              />
              <div className="admin-media-actions">
                <button
                  type="button"
                  className="admin-button"
                  onClick={() => copy(file.url)}
                >
                  <Copy size={15} />
                  Copy path
                </button>
                <button
                  type="button"
                  className="admin-icon-button admin-danger"
                  aria-label={`Delete ${file.name}`}
                  disabled={busy}
                  onClick={() => remove(file.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {files.length === 0 && (
        <div className="admin-empty">
          <h2>Your library is ready.</h2>
          <p>
            Upload a portrait, project image, sharing image, or CV. Existing
            website assets can also be used by their current paths.
          </p>
        </div>
      )}
    </>
  );
}
