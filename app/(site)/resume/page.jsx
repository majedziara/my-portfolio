import ResumeContent from "@/components/ResumeContent";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/content";
export const generateMetadata = () => pageMetadata("resume");
export default async function Resume() {
  const { profile, resume } = await getSiteContent();
  return <><div className="container mx-auto pt-6"><h1 className="h2">{resume.heading}</h1></div><ResumeContent profile={profile} resume={resume} /></>;
}
