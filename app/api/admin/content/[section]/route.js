import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDatabase, getContentDocument } from "@/lib/content";
import { validateSection, sectionSchemas } from "@/lib/content-validation";
import { verifyMediaReferences } from "@/lib/admin/media-validation";
import {
  adminRequest,
  readJson,
  privateJson,
  apiError,
  HttpError,
} from "@/lib/admin/http";
export async function GET(request, { params }) {
  try {
    await adminRequest(request);
    const { section } = await params;
    if (!Object.hasOwn(sectionSchemas, section))
      throw new HttpError(404, "Section not found.");
    const { content, revision } = await getContentDocument();
    return privateJson({ data: content[section], revision });
  } catch (error) {
    return apiError(error);
  }
}
export async function PUT(request, { params }) {
  try {
    await adminRequest(request, true);
    const { section } = await params;
    if (!Object.hasOwn(sectionSchemas, section))
      throw new HttpError(404, "Section not found.");
    const input = z
      .object({ revision: z.number().int().positive(), data: z.unknown() })
      .strict()
      .safeParse(await readJson(request));
    if (!input.success) throw new HttpError(400, "Invalid content data.");
    let data;
    try {
      data = validateSection(section, input.data.data);
    } catch (error) {
      const issue = error.issues?.[0];
      throw new HttpError(
        400,
        issue ? `${issue.path.join(".")}: ${issue.message}` : error.message,
      );
    }
    const updatedAt = new Date();
    const db = await getDatabase();
    await verifyMediaReferences(db, section, data);
    const result = await db
      .collection("site_content")
      .updateOne(
        { _id: "portfolio", revision: input.data.revision },
        {
          $set: { [`content.${section}`]: data, updatedAt },
          $inc: { revision: 1 },
        },
      );
    if (!result.matchedCount)
      throw new HttpError(
        409,
        "Content changed in another session. Reload the latest version before saving.",
      );
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    return privateJson({
      success: true,
      data,
      revision: input.data.revision + 1,
      updatedAt: updatedAt.toISOString(),
    });
  } catch (error) {
    return apiError(error);
  }
}
