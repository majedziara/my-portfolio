import { profile } from "@/data/profile";

// Set SITE_URL when moving the portfolio to a custom domain.
export const siteUrl = new URL(
  process.env.SITE_URL || "https://majed-ziara-portfolio.vercel.app",
).origin;
export const siteTitle = `${profile.name} | ${profile.title}`;
export const siteDescription =
  "Majed Ziara is a Laravel backend and full-stack engineer building REST APIs, business systems, payment integrations, and Next.js applications. Available remotely.";
export const socialImage = {
  url: "/og-image.png", width: 1200, height: 630,
  alt: "Majed Ziara — Laravel Backend & Full-Stack Engineer",
};
export function pageMetadata(title, description, path = "/") {
  const fullTitle = path === "/" ? siteTitle : `${title} | ${profile.name}`;
  return {
    title: path === "/" ? { absolute: siteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website", locale: "en_US", siteName: `${profile.name} Portfolio`,
      title: fullTitle, description, url: path, images: [socialImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [socialImage] },
  };
}
