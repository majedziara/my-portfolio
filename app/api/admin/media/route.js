import sharp from "sharp";
import { GridFSBucket, ObjectId } from "mongodb";
import { finished } from "node:stream/promises";
import { getDatabase } from "@/lib/content";
import {
  adminRequest,
  readBytes,
  readJson,
  privateJson,
  apiError,
  HttpError,
} from "@/lib/admin/http";
const maxSize = 4 * 1024 * 1024;
export async function GET(request) {
  try {
    await adminRequest(request);
    const db = await getDatabase();
    const files = await db
      .collection("media.files")
      .find({ "metadata.public": true })
      .sort({ uploadDate: -1 })
      .limit(200)
      .toArray();
    return privateJson({
      files: files.map((file) => ({
        id: file._id.toHexString(),
        name: file.filename,
        type: file.metadata.contentType,
        size: file.length,
        url: `/api/media/${file._id.toHexString()}`,
        createdAt: file.uploadDate.toISOString(),
      })),
    });
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request) {
  try {
    await adminRequest(request, true);
    if (
      !request.headers.get("content-type")?.startsWith("multipart/form-data;")
    )
      throw new HttpError(415, "Choose an image or PDF file.");
    const bytes = await readBytes(request, maxSize + 128000);
    const form = await new Response(bytes, {
      headers: { "content-type": request.headers.get("content-type") },
    }).formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > maxSize)
      throw new HttpError(400, "Choose a file under 4 MB.");
    const buffer = Buffer.from(await file.arrayBuffer());
    let data, contentType, filename;
    const safeName =
      file.name.replace(/[^A-Za-z0-9_.-]/g, "-").slice(0, 100) || "upload";
    if (file.type === "application/pdf") {
      if (
        buffer.subarray(0, 5).toString() !== "%PDF-" ||
        !buffer.subarray(-2048).includes(Buffer.from("%%EOF"))
      )
        throw new HttpError(400, "Choose a valid PDF file.");
      data = buffer;
      contentType = "application/pdf";
      filename = safeName.replace(/\.pdf$/i, "") + ".pdf";
    } else {
      if (
        !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
          file.type,
        )
      )
        throw new HttpError(400, "Use a JPG, PNG, WebP, AVIF image, or PDF.");
      try {
        const processor = sharp(buffer, {
          limitInputPixels: 40000000,
          animated: false,
        });
        const metadata = await processor.metadata();
        if (!["jpeg", "png", "webp", "avif", "heif"].includes(metadata.format))
          throw new Error("Unsupported image");
        data = await processor
          .rotate()
          .resize({
            width: 2000,
            height: 2000,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
      } catch {
        throw new HttpError(
          400,
          "The image could not be read. Choose a valid image.",
        );
      }
      contentType = "image/webp";
      filename = safeName.replace(/\.[^.]+$/, "") + ".webp";
    }
    const bucket = new GridFSBucket(await getDatabase(), {
      bucketName: "media",
    });
    const stream = bucket.openUploadStream(filename, {
      metadata: { public: true, contentType },
    });
    stream.end(data);
    await finished(stream);
    return privateJson(
      {
        file: {
          id: stream.id.toHexString(),
          name: filename,
          type: contentType,
          size: data.length,
          url: `/api/media/${stream.id.toHexString()}`,
        },
      },
      201,
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function DELETE(request) {
  try {
    await adminRequest(request, true);
    const input = await readJson(request, 1000);
    if (
      !input ||
      typeof input.id !== "string" ||
      !/^[a-f0-9]{24}$/.test(input.id)
    )
      throw new HttpError(400, "Choose a valid file.");
    const db = await getDatabase();
    const document = await db
      .collection("site_content")
      .findOne({ _id: "portfolio" });
    if (JSON.stringify(document?.content).includes(`/api/media/${input.id}`))
      throw new HttpError(
        409,
        "This file is used on the website. Replace it in the content before deleting it.",
      );
    const file = await db
      .collection("media.files")
      .findOne({ _id: new ObjectId(input.id), "metadata.public": true });
    if (!file) throw new HttpError(404, "File not found.");
    await new GridFSBucket(db, { bucketName: "media" }).delete(file._id);
    return privateJson({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
