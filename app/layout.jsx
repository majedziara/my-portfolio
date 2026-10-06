import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import StairTransition from "@/components/StairTransition";
import { Analytics } from "@vercel/analytics/next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500','600','700','800'],
  variable: "--font-jetbrainsMono",
});

export const metadata = {
  title: "Majed Ziara | Laravel Backend & Full-Stack Engineer",
  description:
    "Portfolio of Majed Ziara, a Laravel backend and full-stack engineer building APIs, business systems, payments, integrations, and multilingual Next.js applications.",
  keywords: [
    "Majed Ziara",
    "Majed Ziara Portfolio",
    "Software Developer",
    "Full-Stack Developer",
    "Web Developer",
    "Laravel Developer",
    "PHP Laravel Engineer",
    "Next.js Developer",
    "Front-End Developer",
    "Back-End Developer",
    "REST API Developer",
    "Modern Web Development",
    "Responsive Web Design",
    "JavaScript Developer",
    "HTML CSS JavaScript",
    "Freelance Developer",
    "IT Developer Portfolio",
    "Tech Projects Portfolio",
    "Web Applications Developer",
    "Digital Solutions Developer",
    "Payment Integration",
    "Laravel REST APIs",
    "Multilingual Web Applications",
    "Scalable App Development"
  ]
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={jetbrainsMono.variable}
      >
      <Header />
      <StairTransition />
        <PageTransition>
          {children}
        </PageTransition>
        <Analytics/>
      </body>
    </html>
  );
}
