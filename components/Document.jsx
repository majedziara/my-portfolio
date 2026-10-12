import { JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
const font = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrainsMono",
  display: "swap",
});
export default function Document({ children }) {
  return (
    <html lang="en">
      <body className={font.variable}>{children}</body>
    </html>
  );
}
