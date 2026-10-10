import { siteUrl } from "@/lib/seo";

export default function sitemap() {
  const lastModified = new Date();

  return ["/", "/services", "/resume", "/work", "/contact"].map((path) => ({
    url: new URL(path, siteUrl).href,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
