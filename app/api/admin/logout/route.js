import { getDatabase } from "@/lib/content";
import { sessionCookie, cookieOptions } from "@/lib/admin/auth";
import { adminRequest, privateJson, apiError } from "@/lib/admin/http";
export async function POST(request) {
  try {
    const session = await adminRequest(request, true);
    await (
      await getDatabase()
    )
      .collection("admin_sessions")
      .deleteOne({ _id: session.tokenHash });
    const response = privateJson({ success: true });
    response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
