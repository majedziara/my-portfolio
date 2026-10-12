import { requireAdminPage } from "@/lib/admin/auth";
import { getDatabase } from "@/lib/content";
import MediaLibrary from "@/components/admin/MediaLibrary";
export const metadata = { title: "Media library" };
export default async function MediaPage() {
  const session = await requireAdminPage();
  const rows = await (
    await getDatabase()
  )
    .collection("media.files")
    .find({ "metadata.public": true })
    .sort({ uploadDate: -1 })
    .limit(200)
    .toArray();
  const files = rows.map((file) => ({
    id: file._id.toHexString(),
    name: file.filename,
    type: file.metadata.contentType,
    size: file.length,
    url: `/api/media/${file._id.toHexString()}`,
  }));
  return <MediaLibrary initialFiles={files} csrf={session.csrf} />;
}
