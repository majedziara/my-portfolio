import Document from "@/components/Document";
export const viewport = { themeColor: "#1c1c22", colorScheme: "dark" };
export default function StudioLayout({ children }) {
  return <Document>{children}</Document>;
}
