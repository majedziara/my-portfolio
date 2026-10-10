import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

const limits = { firstName: 100, lastName: 100, email: 254, phone: 40, service: 100, message: 5000 };
const services = ["", "laravel-backend", "full-stack", "integrations", "maintenance"];
export async function POST(request) {
  // Reject invalid input before opening a database connection.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Please send JSON data." }, { status: 415 });
  }
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 24000) {
    return NextResponse.json({ error: "Your message is too long." }, { status: 413 });
  }
  let input;
  try { input = JSON.parse(body); } catch {
    return NextResponse.json({ error: "Invalid message data." }, { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ error: "Invalid message data." }, { status: 400 });
  }
  const data = {};
  for (const [field, limit] of Object.entries(limits)) {
    const value = input[field] ?? "";
    if (typeof value !== "string" || value.length > limit) {
      return NextResponse.json({ error: `Invalid ${field} field.` }, { status: 400 });
    }
    data[field] = value.trim();
  }
  if (!data.firstName || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !services.includes(data.service)) {
    return NextResponse.json({ error: "Please enter your first name, a valid email, and a message, and select a valid service." }, { status: 400 });
  }
  try {
    const client = await getMongoClient();
    await client.db(process.env.DATABASE_NAME).collection("contacts").insertOne({ ...data, createdAt: new Date() });
    return NextResponse.json({ success: true, message: "Message was sent" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to send your message. Please try again or contact me by email." }, { status: 500 });
  }
}
