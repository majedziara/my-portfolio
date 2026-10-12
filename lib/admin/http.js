import "server-only";
import { NextResponse } from "next/server";
import { getAdminSession } from "./auth";
import { equalSecret } from "./crypto";
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export function privateJson(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    origin !== new URL(request.url).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError(403, "Request not allowed.");
}
export async function adminRequest(request, mutation = false) {
  const session = await getAdminSession();
  if (!session) throw new HttpError(401, "Sign in to continue.");
  if (mutation) {
    sameOrigin(request);
    if (!equalSecret(request.headers.get("x-csrf-token"), session.csrf))
      throw new HttpError(403, "Request not allowed.");
  }
  return session;
}
export async function readBytes(request, maxBytes) {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Missing request data.");
  const chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new HttpError(413, "Request is too large.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
export async function readJson(request, maxBytes = 256000) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new HttpError(415, "Please send JSON data.");
  const body = await readBytes(request, maxBytes);
  try {
    return JSON.parse(body.toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid request data.");
  }
}
export function apiError(error) {
  if (error instanceof HttpError)
    return privateJson({ error: error.message }, error.status);
  return privateJson(
    { error: "The request could not be completed. Please try again." },
    503,
  );
}
