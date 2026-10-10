import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import ContactForm from "@/components/ContactForm";
import AnimatedPage from "@/components/AnimatedPage";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Contact & Hire Me",
  "Contact Majed Ziara for Laravel backend development, Next.js applications, REST APIs, and payment integrations. Based in Gaza and available for remote projects.",
  "/contact",
);
const info = [
  { icon: <FaPhoneAlt />, title: "Phone", description: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { icon: <FaEnvelope />, title: "Email", description: profile.email, href: `mailto:${profile.email}` },
  { icon: <FaMapMarkerAlt />, title: "Location", description: profile.location },
];
export default function Contact() {
  return (
    <AnimatedPage as="section" className="py-6">
      <div className="container mx-auto">
        <h1 className="h2 mb-10">Contact me</h1>
        <div className="flex flex-col lg:flex-row gap-[30px]">
          <div className="order-2 lg:order-1 lg:w-[58%]"><ContactForm /></div>
          <div className="flex-1 min-w-0 flex items-center lg:justify-end order-1 lg:order-2 mb-8 lg:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item) => (
                <li key={item.title} className="flex items-center gap-4">
                  <div aria-hidden="true" className="shrink-0 w-[52px] h-[52px] lg:h-[72px] lg:w-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center text-[28px]">{item.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white/70">{item.title}</p>
                    <p className="text-base xl:text-xl break-words">{item.href ? <a href={item.href} className="hover:text-accent">{item.description}</a> : item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
