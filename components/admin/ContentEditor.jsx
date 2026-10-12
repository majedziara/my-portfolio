"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  Save,
} from "lucide-react";
import { emptyFields } from "@/lib/content-definition";
const localAsset = (value) =>
  typeof value === "string" &&
  value.startsWith("/") &&
  !value.startsWith("//") &&
  !value.includes("..") &&
  (/^\/assets\//.test(value) ||
    /^\/api\/media\/[a-f0-9]{24}$/.test(value) ||
    /^\/[a-zA-Z0-9_-]+\.(png|webp|svg|jpg|jpeg)$/.test(value));
function AssetField({ field, value, onChange, csrf, id }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function upload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Choose a file under 4 MB.");
      return;
    }
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "X-CSRF-Token": csrf },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      onChange(data.file.url);
    } catch (error) {
      setError(error.message || "Upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }
  return (
    <div className="admin-asset-field">
      {field.accept === "image" && localAsset(value) && (
        <div className="admin-asset-preview">
          <Image
            src={value}
            alt={`${field.label} preview`}
            fill
            sizes="180px"
            unoptimized
            className="object-contain"
          />
        </div>
      )}
      <input
        id={id}
        className="admin-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={300}
        required
        aria-label={field.label}
      />
      <label className="admin-upload-button">
        <Upload size={16} aria-hidden="true" />
        {busy
          ? "Uploading…"
          : field.accept === "pdf"
            ? "Upload PDF"
            : "Upload image"}
        <input
          type="file"
          accept={
            field.accept === "pdf"
              ? "application/pdf"
              : "image/jpeg,image/png,image/webp,image/avif"
          }
          disabled={busy}
          onChange={upload}
          className="sr-only"
        />
      </label>
      <p role="status" className="admin-error">
        {error}
      </p>
    </div>
  );
}
function Fields({ fields, values, onChange, prefix, csrf }) {
  return fields.map((field) => {
    const value = values[field.key],
      id = `${prefix}-${field.key}`;
    const set = (next) => onChange({ ...values, [field.key]: next });
    if (field.type === "object")
      return (
        <fieldset key={id} className="admin-fieldset">
          <legend>{field.label}</legend>
          <div className="admin-form-grid">
            <Fields
              fields={field.fields}
              values={value}
              onChange={set}
              prefix={id}
              csrf={csrf}
            />
          </div>
        </fieldset>
      );
    if (field.type === "array")
      return (
        <fieldset key={id} className="admin-fieldset">
          <legend>
            {field.label}
            <span className="admin-count">{value.length}</span>
          </legend>
          <div className="admin-repeater">
            {value.map((item, index) => (
              <div key={index} className="admin-repeat-item">
                <div className="admin-repeat-header">
                  <span>
                    {item.title ||
                      item.name ||
                      item.company ||
                      item.label ||
                      `Entry ${index + 1}`}
                  </span>
                  <div>
                    <button
                      type="button"
                      className="admin-icon-button"
                      disabled={index === 0}
                      aria-label={`Move ${field.label} entry ${index + 1} up`}
                      onClick={() => {
                        const next = [...value];
                        [next[index - 1], next[index]] = [
                          next[index],
                          next[index - 1],
                        ];
                        set(next);
                      }}
                    >
                      <ArrowUp size={17} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-button"
                      disabled={index === value.length - 1}
                      aria-label={`Move ${field.label} entry ${index + 1} down`}
                      onClick={() => {
                        const next = [...value];
                        [next[index + 1], next[index]] = [
                          next[index],
                          next[index + 1],
                        ];
                        set(next);
                      }}
                    >
                      <ArrowDown size={17} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-button admin-danger"
                      disabled={value.length <= (field.min ?? 0)}
                      aria-label={`Remove ${field.label} entry ${index + 1}`}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Remove this entry? It will be removed from the website after you save.",
                          )
                        )
                          set(
                            value.filter((_, position) => position !== index),
                          );
                      }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
                <div className="admin-form-grid">
                  <Fields
                    fields={field.fields}
                    values={item}
                    onChange={(next) =>
                      set(
                        value.map((row, position) =>
                          position === index ? next : row,
                        ),
                      )
                    }
                    prefix={`${id}-${index}`}
                    csrf={csrf}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="admin-button"
            disabled={value.length >= (field.max ?? 50)}
            onClick={() => set([...value, emptyFields(field.fields)])}
          >
            <Plus size={16} />
            Add entry
          </button>
        </fieldset>
      );
    const wide = ["textarea", "stringlist", "file"].includes(field.type);
    return (
      <div
        key={id}
        className={wide ? "admin-field admin-field-wide" : "admin-field"}
      >
        <label htmlFor={id}>
          {field.label}
          {field.optional && <span className="admin-muted"> · optional</span>}
        </label>
        {field.type === "file" ? (
          <AssetField
            field={field}
            value={value}
            onChange={set}
            csrf={csrf}
            id={id}
          />
        ) : field.type === "textarea" || field.type === "stringlist" ? (
          <>
            <textarea
              id={id}
              className="admin-input"
              rows={field.type === "stringlist" ? 4 : 3}
              maxLength={field.max ?? 10000}
              value={field.type === "stringlist" ? value.join("\n") : value}
              onChange={(event) =>
                set(
                  field.type === "stringlist"
                    ? event.target.value.split("\n")
                    : event.target.value,
                )
              }
              required={!field.optional && field.type !== "stringlist"}
            />
            {field.type === "stringlist" && (
              <p className="admin-field-hint">One item per line.</p>
            )}
          </>
        ) : field.type === "select" ? (
          <select
            id={id}
            className="admin-input"
            value={value}
            onChange={(event) => set(event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            className="admin-input"
            type={
              field.type === "url"
                ? "url"
                : field.type === "email"
                  ? "email"
                  : field.type === "number"
                    ? "number"
                    : "text"
            }
            min={field.type === "number" ? 0 : undefined}
            max={field.type === "number" ? field.max : undefined}
            maxLength={field.max ?? 500}
            value={value}
            onChange={(event) =>
              set(
                field.type === "number"
                  ? Number(event.target.value)
                  : event.target.value,
              )
            }
            required={!field.optional}
          />
        )}
      </div>
    );
  });
}
export default function ContentEditor({
  section,
  initialData,
  initialRevision,
  csrf,
}) {
  const id = useId(),
    router = useRouter();
  const [values, setValues] = useState(initialData),
    [saved, setSaved] = useState(JSON.stringify(initialData)),
    [revision, setRevision] = useState(initialRevision),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [conflict, setConflict] = useState(false);
  const formRef = useRef(null);
  const dirty = JSON.stringify(values) !== saved;
  useEffect(() => {
    if (!dirty) return;
    function beforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }
    function navigation(event) {
      const anchor = event.target.closest("a");
      if (
        anchor &&
        anchor.target !== "_blank" &&
        anchor.getAttribute("href") !== window.location.pathname &&
        !window.confirm("You have unsaved changes. Leave without saving?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", navigation, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", navigation, true);
    };
  }, [dirty]);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setConflict(false);
    try {
      const response = await fetch(`/api/admin/content/${section.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ data: values, revision }),
      });
      const result = await response.json();
      if (!response.ok) {
        setConflict(response.status === 409);
        throw new Error(result.error);
      }
      setRevision(result.revision);
      setValues(result.data);
      setSaved(JSON.stringify(result.data));
      setMessage("Saved. Your website is up to date.");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Could not save. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function reload() {
    if (
      !window.confirm(
        "Load the latest saved version? Your unsaved changes will be discarded.",
      )
    )
      return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/content/${section.key}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setValues(result.data);
      setSaved(JSON.stringify(result.data));
      setRevision(result.revision);
      setConflict(false);
      setMessage("Latest version loaded.");
    } catch (error) {
      setMessage(error.message || "Could not load content.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      ref={formRef}
      onSubmit={save}
      aria-busy={busy}
      className="admin-editor"
    >
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">CONTENT</p>
          <h1>{section.label}</h1>
          <p className="admin-muted">{section.description}</p>
        </div>
        <button
          className="admin-button admin-button-primary"
          disabled={busy || !dirty}
        >
          <Save size={17} />
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
      <div className="admin-editor-state">
        <span className={dirty ? "admin-unsaved" : "admin-muted"}>
          {dirty ? (
            "Unsaved changes"
          ) : (
            <>
              <Check size={14} />
              All changes saved
            </>
          )}
        </span>
        <span>Revision {revision}</span>
      </div>
      <p
        role="status"
        className={
          message.startsWith("Saved") ? "admin-success" : "admin-error"
        }
      >
        {message}
      </p>
      {conflict && (
        <button
          type="button"
          className="admin-button"
          onClick={reload}
          disabled={busy}
        >
          Load latest version
        </button>
      )}
      <fieldset disabled={busy} className="admin-content-fields">
        <div className="admin-form-grid">
          <Fields
            fields={section.fields}
            values={values}
            onChange={setValues}
            prefix={id}
            csrf={csrf}
          />
        </div>
      </fieldset>
      <div className="admin-editor-footer">
        <span className="admin-muted">
          Changes appear on the website after saving.
        </span>
        <button
          className="admin-button admin-button-primary"
          disabled={busy || !dirty}
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
