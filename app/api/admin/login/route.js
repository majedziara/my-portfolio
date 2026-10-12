import { z } from "zod";
import { getDatabase } from "@/lib/content";
import {
  authSecret,
  identityDigest,
  randomToken,
  secretDigest,
  verifyPassword,
} from "@/lib/admin/crypto";
import { sessionCookie, cookieOptions } from "@/lib/admin/auth";
import {
  sameOrigin,
  readJson,
  privateJson,
  apiError,
  HttpError,
} from "@/lib/admin/http";
import { rateLimit, clientAddress } from "@/lib/admin/rate-limit";
const credentials = z
  .object({
    username: z.string().trim().min(1).max(100),
    password: z.string().min(1).max(128),
  })
  .strict();
export async function POST(request) {
  try {
    sameOrigin(request);
    authSecret();
    const input = credentials.safeParse(await readJson(request, 3000));
    if (!input.success)
      throw new HttpError(400, "Unable to sign in. Check your credentials.");
    const { username, password } = input.data;
    if (!(await rateLimit("login:global", 100)))
      throw new HttpError(429, "Too many attempts. Please try again later.");
    const digest = identityDigest(username);
    const allowed = await Promise.all([
      rateLimit(`login:address:${clientAddress(request)}`, 10),
      rateLimit(`login:identity:${digest}`, 10),
    ]);
    if (allowed.some((value) => !value))
      throw new HttpError(429, "Too many attempts. Please try again later.");
    const db = await getDatabase();
    const admin = await db
      .collection("admins")
      .findOne({ identityDigest: digest, active: true });
    if (!(await verifyPassword(password, admin?.passwordHash)))
      throw new HttpError(401, "Unable to sign in. Check your credentials.");
    const token = randomToken();
    await db
      .collection("admin_sessions")
      .insertOne({
        _id: secretDigest(token),
        adminId: admin._id.toHexString(),
        credentialVersion: secretDigest(admin.passwordHash),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + cookieOptions.maxAge * 1000),
      });
    const response = privateJson({ success: true });
    response.cookies.set(sessionCookie, token, cookieOptions);
    return response;
  } catch (error) {
    return apiError(error);
  }
}
