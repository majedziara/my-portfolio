import { siteUrl } from '@/lib/seo';
export default function robots() {
  return { rules: { userAgent: '*', allow: ['/', '/api/media/'], disallow: ['/api/', '/admin', '/admin/'] }, sitemap: `${siteUrl}/sitemap.xml` };
}
