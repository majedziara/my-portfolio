import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { getContentDocument } from "@/lib/content";
import { sectionByKey } from "@/lib/content-definition";
import ContentEditor from "@/components/admin/ContentEditor";
export const metadata = { title: "Edit content" };
export default async function ContentPage({ params }) {
  const session = await requireAdminPage();
  const { section } = await params;
  if (!Object.hasOwn(sectionByKey, section)) notFound();
  const { content, revision } = await getContentDocument();
  return (
    <ContentEditor
      key={section}
      section={sectionByKey[section]}
      initialData={content[section]}
      initialRevision={revision}
      csrf={session.csrf}
    />
  );
}
