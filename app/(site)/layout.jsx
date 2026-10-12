import Document from "@/components/Document";
import Header from "@/components/Header";
import StairTransition from "@/components/StairTransition";
import PageTransition from "@/components/PageTransition";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import { getSiteContent } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const viewport = { themeColor: "#1c1c22", colorScheme: "dark" };
export async function generateMetadata() {
  const { profile, seo } = await getSiteContent();
  return {
    ...(await pageMetadata("home")),
    metadataBase: new URL(siteUrl),
    title: { default: seo.title, template: `%s | ${profile.name}` },
    applicationName: `${profile.name} Portfolio`,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    keywords: seo.keywords,
    verification: { google: seo.googleVerification || undefined },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "technology",
  };
}
export default async function SiteLayout({ children }) {
  const { profile, home, navigation, seo, resume } = await getSiteContent();
  return (
    <Document>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header navigation={navigation} profileName={profile.name} />
      <StairTransition />
      <PageTransition>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </PageTransition>
      <noscript>
        <style>{`[data-screen-transition] { display: none !important; } [data-page-reveal], [data-portrait-reveal] { opacity: 1 !important; }`}</style>
      </noscript>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": `${siteUrl}/#person`,
              name: profile.name,
              url: siteUrl,
              jobTitle: profile.title,
              description: profile.summary,
              image: new URL(home.photoUrl, siteUrl).href,
              sameAs: [profile.github, profile.linkedin],
              knowsAbout: resume.skills.map((skill) => skill.name),
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              name: `${profile.name} Portfolio`,
              url: siteUrl,
              description: seo.description,
              inLanguage: "en",
              author: { "@id": `${siteUrl}/#person` },
            },
          ],
        }}
      />
      {process.env.NODE_ENV === "production" && seo.googleAnalyticsId && (
        <GoogleAnalytics measurementId={seo.googleAnalyticsId} />
      )}
      {process.env.VERCEL === "1" && <Analytics />}
    </Document>
  );
}
