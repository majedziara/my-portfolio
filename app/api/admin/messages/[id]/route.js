import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDatabase } from "@/lib/content";
import {
  adminRequest,
  readJson,
  privateJson,
  apiError,
  HttpError,
} from "@/lib/admin/http";
export async function PATCH(request, { params }) {
  try {
    await adminRequest(request, true);
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/.test(id))
      throw new HttpError(404, "Message not found.");
    const parsed = z
      .object({ status: z.enum(["new", "read", "archived"]) })
      .strict()
      .safeParse(await readJson(request, 1000));
    if (!parsed.success)
      throw new HttpError(400, "Choose a valid message status.");
    const result = await (
      await getDatabase()
    )
      .collection("contacts")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: parsed.data.status, updatedAt: new Date() } },
      );
    if (!result.matchedCount) throw new HttpError(404, "Message not found.");
    return privateJson({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
