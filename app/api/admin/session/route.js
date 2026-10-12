import { adminRequest, privateJson, apiError } from "@/lib/admin/http";
export async function GET(request) {
  try {
    const session = await adminRequest(request);
    return privateJson({ csrf: session.csrf });
  } catch (error) {
    return apiError(error);
  }
}
