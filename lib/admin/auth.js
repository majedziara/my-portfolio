import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ObjectId } from "mongodb";
import { getDatabase } from "../content";
import { csrfFor, secretDigest } from "./crypto";

export const sessionCookie =
  process.env.NODE_ENV === "production"
    ? "__Host-portfolio_admin"
    : "portfolio_admin";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 8 * 60 * 60,
};
export const getAdminSession = cache(async () => {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const db = await getDatabase();
  const session = await db
    .collection("admin_sessions")
    .findOne({ _id: secretDigest(token), expiresAt: { $gt: new Date() } });
  if (!session || !ObjectId.isValid(session.adminId)) return null;
  const admin = await db
    .collection("admins")
    .findOne({ _id: new ObjectId(session.adminId), active: true });
  if (!admin || session.credentialVersion !== secretDigest(admin.passwordHash))
    return null;
  return {
    adminId: admin._id.toHexString(),
    csrf: csrfFor(token),
    tokenHash: session._id,
  };
});
export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
