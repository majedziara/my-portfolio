import { siteUrl } from '@/lib/seo';
import { getContentDocument } from '@/lib/content';
export const dynamic = 'force-dynamic';
export default async function sitemap() {
  const { updatedAt } = await getContentDocument();
  return ['/', '/services', '/resume', '/work', '/contact'].map(path => ({ url: new URL(path, siteUrl).href, lastModified: updatedAt, changeFrequency: 'weekly', priority: path === '/' ? 1 : 0.8 }));
}
