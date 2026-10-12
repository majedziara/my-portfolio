import {
  profile,
  experience,
  education,
  services,
  projects,
} from "./profile.js";

const title = `${profile.name} | ${profile.title}`;
const description =
  "Majed Ziara is a Laravel backend and full-stack engineer building REST APIs, business systems, payment integrations, and Next.js applications. Available remotely.";
export const defaultContent = {
  profile: {
    ...profile,
    nationality: "Palestinian",
    languages: "Arabic, English, Russian",
  },
  home: {
    greeting: "Hello, I'm",
    downloadLabel: "Download CV",
    cvUrl: "/assets/majed-ziara-cv-2026.pdf",
    photoUrl: "/assets/my-picture.webp",
    photoAlt:
      "Illustrated portrait of Majed Ziara, Laravel and Next.js developer",
    statistics: [
      { num: 4, suffix: "+", text: "Years of experience" },
      { num: 10, suffix: "+", text: "Projects completed" },
      { num: 5, suffix: "–6", text: "Client sites delivered at DIGO" },
      { num: 2, suffix: "", text: "Languages supported in products" },
    ],
  },
  resume: {
    heading: "Experience & skills",
    experienceTitle: "My Experience",
    experienceDescription:
      "My work centers on Laravel backends and full-stack products, from requirements and data modeling through deployment, integrations, and production support. I paused professional work from November 2023 to June 2025 because of war conditions in Gaza and returned in July 2025.",
    educationTitle: "My Education",
    educationDescription:
      "An Information Technology foundation supported by continued learning in software engineering, languages, and practical AI literacy.",
    skillsTitle: "My Skills",
    skillsDescription:
      "My strongest skills are Laravel backend engineering and full-stack product delivery. I use Next.js for modern interfaces and work comfortably with relational data, caching, version control, and production environments.",
    aboutTitle: "About me",
    tabs: {
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      about: "About me",
    },
    experience,
    education,
    skills: [
      { name: "PHP", icon: "php" },
      { name: "Laravel", icon: "laravel" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Redis", icon: "redis" },
      { name: "Git & GitHub", icon: "git" },
      { name: "Docker fundamentals", icon: "docker" },
    ],
    aboutInfo: [
      "name",
      "phone",
      "experience",
      "nationality",
      "email",
      "languages",
    ].map((source) => ({
      label: source[0].toUpperCase() + source.slice(1),
      source,
      value: "",
    })),
  },
  services: { heading: "Development services", items: services },
  work: { heading: "Selected projects", projects },
  contact: {
    heading: "Contact me",
    phoneLabel: "Phone",
    emailLabel: "Email",
    locationLabel: "Location",
    formTitle: "Let's work together",
    formDescription:
      "Looking for a professional web application, custom business system, or SaaS solution? Share your project details, and I'll get back to you with a development plan.",
    instructions: "First name, email, and message are required.",
    labels: {
      firstName: "First name (required)",
      lastName: "Last name",
      email: "Email (required)",
      phone: "Phone number",
      service: "Service",
      message: "Message (required)",
    },
    servicePlaceholder: "Select a service",
    messagePlaceholder: "Tell me about your project.",
    submitLabel: "Send Message",
    sendingLabel: "Sending…",
    successMessage: "Your message was sent, I'll reply soon.",
    serviceOptions: [
      { value: "laravel-backend", label: "Laravel Backend Development" },
      { value: "full-stack", label: "Full-Stack Web Application" },
      { value: "integrations", label: "Payments & API Integrations" },
      { value: "maintenance", label: "Maintenance & Product Support" },
    ],
  },
  navigation: {
    logoText: "Majed",
    logoAccent: ".",
    hireLabel: "Hire me",
    links: [
      { name: "home", path: "/" },
      { name: "services", path: "/services" },
      { name: "resume", path: "/resume" },
      { name: "work", path: "/work" },
      { name: "contact", path: "/contact" },
    ],
  },
  seo: {
    title,
    description,
    keywords: [
      "Majed Ziara",
      "ماجد زيارة",
      "Laravel Developer",
      "PHP Developer",
      "Full-Stack Engineer",
      "Next.js Developer",
      "React Developer",
      "REST API Development",
      "Payment Integrations",
      "Freelance Web Developer",
      "Gaza Palestine Developer",
      "Remote Software Engineer",
    ],
    ogImage: "/og-image.png",
    ogImageAlt: "Majed Ziara — Laravel Backend & Full-Stack Engineer",
    googleVerification: "PNPw-FFy-OJowtOOJyXNngOL1AWrfvNVEtd_GczupYY",
    googleAnalyticsId: "G-T8HQENKS1N",
    pages: {
      home: { title, description },
      services: {
        title: "Laravel & Full-Stack Development Services",
        description:
          "Laravel backend development, full-stack Next.js applications, payment and API integrations, and ongoing product support by Majed Ziara. Available remotely.",
      },
      resume: {
        title: "Resume & Skills",
        description:
          "Explore Majed Ziara’s Laravel and full-stack development experience, education, and skills in PHP, Next.js, React, databases, and integrations.",
      },
      work: {
        title: "Laravel & Next.js Projects",
        description:
          "Browse Majed Ziara’s Laravel and Next.js projects: digital stores, charity platforms, business systems, multilingual websites, and payment integrations.",
      },
      contact: {
        title: "Contact & Hire Me",
        description:
          "Contact Majed Ziara for Laravel backend development, Next.js applications, REST APIs, and payment integrations. Based in Gaza and available for remote projects.",
      },
    },
  },
};
