import "server-only";
import { getDatabase } from "../content";
import { secretDigest } from "./crypto";
export async function rateLimit(key, limit, windowMs = 15 * 60 * 1000) {
  const db = await getDatabase();
  const bucket = Math.floor(Date.now() / windowMs);
  const id = `${secretDigest(key)}:${bucket}`;
  const collection = db.collection("rate_limits");
  let result;
  try {
    result = await collection.findOneAndUpdate(
      { _id: id },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) },
      },
      { upsert: true, returnDocument: "after" },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    result = await collection.findOneAndUpdate(
      { _id: id },
      { $inc: { count: 1 } },
      { returnDocument: "after" },
    );
  }
  return result.count <= limit;
}
export function clientAddress(request) {
  // Only accept proxy headers from the deployment platform that sets them.
  if (process.env.VERCEL === "1")
    return (request.headers.get("x-vercel-forwarded-for") || "unknown")
      .split(",")[0]
      .trim()
      .slice(0, 100);
  return "shared-origin";
}
