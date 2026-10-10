import ResumeContent from "@/components/ResumeContent";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Resume & Skills",
  "Explore Majed Ziara’s Laravel and full-stack development experience, education, and skills in PHP, Next.js, React, databases, and integrations.",
  "/resume",
);
export default function Resume() {
  return <><div className="container mx-auto pt-6"><h1 className="h2">Experience & skills</h1></div><ResumeContent /></>;
}
