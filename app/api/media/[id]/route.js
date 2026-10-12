import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { getDatabase } from "@/lib/content";
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/.test(id))
      return new Response("Not found", { status: 404 });
    const db = await getDatabase();
    const file = await db
      .collection("media.files")
      .findOne({ _id: new ObjectId(id), "metadata.public": true });
    if (
      !file ||
      !["image/webp", "application/pdf"].includes(file.metadata?.contentType)
    )
      return new Response("Not found", { status: 404 });
    const etag = `"${id}"`;
    if (request.headers.get("if-none-match") === etag)
      return new Response(null, { status: 304, headers: { ETag: etag } });
    const stream = new GridFSBucket(db, {
      bucketName: "media",
    }).openDownloadStream(file._id);
    return new Response(Readable.toWeb(stream), {
      headers: {
        "Content-Type": file.metadata.contentType,
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `${file.metadata.contentType === "application/pdf" ? "attachment" : "inline"}; filename="${file.filename.replace(/[^A-Za-z0-9_.-]/g, "-")}"`,
      },
    });
  } catch {
    return new Response("File unavailable", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
