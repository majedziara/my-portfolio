import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/data/profile";
import { pageMetadata, siteDescription, siteTitle, siteUrl } from "@/lib/seo";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"], variable: "--font-jetbrainsMono", display: "swap",
});
export const metadata = {
  ...pageMetadata(siteTitle, siteDescription),
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${profile.name}` },
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    "Majed Ziara", "ماجد زيارة", "Laravel Developer", "PHP Developer",
    "Full-Stack Engineer", "Next.js Developer", "React Developer",
    "REST API Development", "Payment Integrations", "Freelance Web Developer",
    "Gaza Palestine Developer", "Remote Software Engineer",
  ],
  verification: { google: "PNPw-FFy-OJowtOOJyXNngOL1AWrfvNVEtd_GczupYY" },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "technology",
};
export const viewport = { themeColor: "#1c1c22", colorScheme: "dark" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <StructuredData data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person", "@id": `${siteUrl}/#person`, name: profile.name,
              url: siteUrl, jobTitle: profile.title, description: profile.summary,
              image: `${siteUrl}/assets/my-picture.webp`, sameAs: [profile.github, profile.linkedin],
              knowsAbout: ["Laravel", "PHP", "Next.js", "React", "REST APIs", "Payment integrations"],
            },
            {
              "@type": "WebSite", "@id": `${siteUrl}/#website`, name: `${profile.name} Portfolio`,
              url: siteUrl, description: siteDescription, inLanguage: "en",
              author: { "@id": `${siteUrl}/#person` },
            },
          ],
        }} />
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
