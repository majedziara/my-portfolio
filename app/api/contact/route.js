import { z } from "zod";
import { NextResponse } from "next/server";
import { getDatabase, getSiteContent } from "@/lib/content";
import { readJson, sameOrigin, HttpError } from "@/lib/admin/http";
import { rateLimit, clientAddress } from "@/lib/admin/rate-limit";
const limits = {
  firstName: 100,
  lastName: 100,
  email: 254,
  phone: 40,
  service: 100,
  message: 5000,
};
export async function POST(request) {
  try {
    sameOrigin(request);
    const input = await readJson(request, 24000);
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new HttpError(400, "Invalid message data.");
    if (typeof input.website === "string" && input.website.trim())
      return NextResponse.json({ success: true }, { status: 201 });
    const data = {};
    for (const [field, limit] of Object.entries(limits)) {
      const value = input[field] ?? "";
      if (typeof value !== "string" || value.length > limit)
        throw new HttpError(400, `Invalid ${field} field.`);
      data[field] = value.trim();
    }
    if (
      !data.firstName ||
      !data.message ||
      !z.email().safeParse(data.email).success
    )
      throw new HttpError(
        400,
        "Please enter your first name, a valid email, and a message.",
      );
    if (
      !(await rateLimit("contact:global", 100, 3600000)) ||
      !(await rateLimit(`contact:${clientAddress(request)}`, 8, 3600000))
    )
      throw new HttpError(429, "Too many messages. Please try again later.");
    const content = await getSiteContent();
    if (
      data.service &&
      !content.contact.serviceOptions.some(
        (option) => option.value === data.service,
      )
    )
      throw new HttpError(400, "Choose a valid service.");
    await (
      await getDatabase()
    )
      .collection("contacts")
      .insertOne({ ...data, status: "new", createdAt: new Date() });
    return NextResponse.json(
      { success: true, message: "Message was sent" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof HttpError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    return NextResponse.json(
      {
        error:
          "Unable to send your message. Please try again or contact me by email.",
      },
      { status: 503 },
    );
  }
}
