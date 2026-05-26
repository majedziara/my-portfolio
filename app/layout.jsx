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
  title: "Majed Ziara | Software Developer Portfolio",
  description:
    "Portfolio of Majed Ziara, a software developer specializing in back-end, front-end, full-stack development, mobile apps, and creative digital solutions.",
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
    "Flutter Mobile Developer",
    "Cross-Platform App Developer",
    "Mobile App Development",
    "Freelance Developer",
    "IT Developer Portfolio",
    "Tech Projects Portfolio",
    "Web Applications Developer",
    "Digital Solutions Developer",
    "UI Development",
    "Clean Code Architect",
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
