import { siteUrl } from "@/lib/seo";
export default function sitemap() {
  return ["/", "/services", "/resume", "/work", "/contact"].map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
  }));
}
