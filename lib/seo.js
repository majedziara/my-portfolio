import 'server-only';
import { getSiteContent } from './content';
export const siteUrl = new URL(process.env.SITE_URL || 'https://majed-ziara-portfolio.vercel.app').origin;
export async function pageMetadata(key) {
  const { profile, seo } = await getSiteContent();
  const page = seo.pages[key];
  const path = key === 'home' ? '/' : `/${key}`;
  const title = key === 'home' ? page.title : `${page.title} | ${profile.name}`;
  return {
    title: { absolute: title }, description: page.description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'en_US', siteName: `${profile.name} Portfolio`, title, description: page.description, url: path, images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogImageAlt }] },
    twitter: { card: 'summary_large_image', title, description: page.description, images: [seo.ogImage] },
  };
}
