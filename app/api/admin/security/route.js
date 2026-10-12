import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/content";
import {
  hashPassword,
  identityDigest,
  verifyPassword,
} from "@/lib/admin/crypto";
import { sessionCookie, cookieOptions } from "@/lib/admin/auth";
import {
  adminRequest,
  readJson,
  privateJson,
  apiError,
  HttpError,
} from "@/lib/admin/http";
import { rateLimit } from "@/lib/admin/rate-limit";
export async function POST(request) {
  try {
    const session = await adminRequest(request, true);
    if (!(await rateLimit(`credentials:${session.adminId}`, 5)))
      throw new HttpError(429, "Too many attempts. Please try again later.");
    const parsed = z
      .object({
        currentPassword: z.string().min(1).max(128),
        newPassword: z.string().min(16).max(128),
        newUsername: z.union([
          z.string().regex(/^[A-Za-z0-9_.@-]{3,100}$/),
          z.literal(""),
        ]),
      })
      .strict()
      .safeParse(await readJson(request, 4000));
    if (!parsed.success)
      throw new HttpError(
        400,
        "Use a password of at least 16 characters and a valid username.",
      );
    const db = await getDatabase();
    const admin = await db
      .collection("admins")
      .findOne({ _id: new ObjectId(session.adminId), active: true });
    if (
      !(await verifyPassword(parsed.data.currentPassword, admin?.passwordHash))
    )
      throw new HttpError(
        400,
        "Unable to update credentials. Check your current password.",
      );
    const fields = {
      passwordHash: await hashPassword(parsed.data.newPassword),
      updatedAt: new Date(),
    };
    if (parsed.data.newUsername)
      fields.identityDigest = identityDigest(parsed.data.newUsername);
    const result = await db
      .collection("admins")
      .updateOne(
        { _id: admin._id, passwordHash: admin.passwordHash, active: true },
        { $set: fields },
      );
    if (!result.matchedCount)
      throw new HttpError(409, "Credentials changed. Sign in again.");
    await db
      .collection("admin_sessions")
      .deleteMany({ adminId: session.adminId });
    const response = privateJson({ success: true });
    response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
