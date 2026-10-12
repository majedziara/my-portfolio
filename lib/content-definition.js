const text = (key, label, extra = {}) => ({
  key,
  label,
  type: "text",
  ...extra,
});
const area = (key, label) => text(key, label, { type: "textarea", max: 8000 });
const file = (key, label, accept = "image") =>
  text(key, label, { type: "file", accept });
const list = (key, label) => text(key, label, { type: "stringlist" });
const array = (key, label, fields, extra = {}) => ({
  key,
  label,
  type: "array",
  fields,
  ...extra,
});
const object = (key, label, fields) => ({ key, label, type: "object", fields });
const choice = (key, label, options) =>
  text(key, label, { type: "select", options });
const pageSeo = [
  text("title", "Page title"),
  area("description", "Search description"),
];
export const skillIcons = [
  "php",
  "laravel",
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "tailwind",
  "mysql",
  "postgresql",
  "redis",
  "git",
  "docker",
  "code",
];
export const contentSections = [
  {
    key: "profile",
    label: "Profile & contact",
    description: "Personal details used throughout the website.",
    fields: [
      text("name", "Full name"),
      text("title", "Professional title"),
      text("email", "Email", { type: "email" }),
      text("phone", "Phone"),
      text("location", "Location"),
      text("experience", "Experience"),
      area("summary", "Profile summary"),
      text("github", "GitHub URL", { type: "url" }),
      text("linkedin", "LinkedIn URL", { type: "url" }),
      text("nationality", "Nationality"),
      text("languages", "Languages"),
    ],
  },
  {
    key: "home",
    label: "Homepage",
    description: "Introduction, portrait, CV, and professional highlights.",
    fields: [
      text("greeting", "Introduction"),
      text("downloadLabel", "CV button"),
      file("cvUrl", "CV file", "pdf"),
      file("photoUrl", "Portrait"),
      text("photoAlt", "Portrait description"),
      array(
        "statistics",
        "Statistics",
        [
          text("num", "Value", { type: "number", max: 1000000 }),
          text("suffix", "Suffix", { optional: true }),
          text("text", "Label"),
        ],
        { max: 8 },
      ),
    ],
  },
  {
    key: "resume",
    label: "Resume & skills",
    description: "Section headings, experience, education, and skills.",
    fields: [
      text("heading", "Page heading"),
      text("experienceTitle", "Experience title"),
      area("experienceDescription", "Experience introduction"),
      text("educationTitle", "Education title"),
      area("educationDescription", "Education introduction"),
      text("skillsTitle", "Skills title"),
      area("skillsDescription", "Skills introduction"),
      text("aboutTitle", "About title"),
      object("tabs", "Tab labels", [
        text("experience", "Experience"),
        text("education", "Education"),
        text("skills", "Skills"),
        text("about", "About"),
      ]),
      array("experience", "Experience entries", [
        text("company", "Company"),
        text("position", "Position"),
        text("duration", "Dates"),
        area("summary", "Description"),
      ]),
      array("education", "Education entries", [
        text("institution", "Institution"),
        text("degree", "Qualification"),
        text("duration", "Dates"),
      ]),
      array("skills", "Skills", [
        text("name", "Name"),
        choice("icon", "Icon", skillIcons),
      ]),
      array("aboutInfo", "About details", [
        text("label", "Label"),
        choice("source", "Profile field", [
          "name",
          "phone",
          "experience",
          "nationality",
          "email",
          "languages",
          "custom",
        ]),
        text("value", "Custom value", { optional: true }),
      ]),
    ],
  },
  {
    key: "services",
    label: "Services",
    description: "Services offered and their descriptions.",
    fields: [
      text("heading", "Page heading"),
      array("items", "Services", [
        text("num", "Number"),
        text("title", "Title"),
        area("description", "Description"),
      ]),
    ],
  },
  {
    key: "work",
    label: "Projects",
    description: "Add, edit, and arrange the projects in your portfolio.",
    fields: [
      text("heading", "Page heading"),
      array("projects", "Projects", [
        text("num", "Number"),
        text("title", "Title"),
        text("category", "Category"),
        text("role", "Your role"),
        area("description", "Description"),
        list("stack", "Technologies"),
        file("image", "Preview image"),
        text("live", "Live website", { type: "url", optional: true }),
        text("github", "Repository URL", { type: "url", optional: true }),
      ]),
    ],
  },
  {
    key: "contact",
    label: "Contact page",
    description: "Page copy, form labels, and service options.",
    fields: [
      text("heading", "Page heading"),
      text("phoneLabel", "Phone label"),
      text("emailLabel", "Email label"),
      text("locationLabel", "Location label"),
      text("formTitle", "Form title"),
      area("formDescription", "Form introduction"),
      text("instructions", "Required fields message"),
      object("labels", "Field labels", [
        text("firstName", "First name"),
        text("lastName", "Last name"),
        text("email", "Email"),
        text("phone", "Phone"),
        text("service", "Service"),
        text("message", "Message"),
      ]),
      text("servicePlaceholder", "Service placeholder"),
      text("messagePlaceholder", "Message placeholder"),
      text("submitLabel", "Send button"),
      text("sendingLabel", "Sending button"),
      text("successMessage", "Success message"),
      array("serviceOptions", "Service choices", [
        text("value", "Service identifier"),
        text("label", "Service name"),
      ]),
    ],
  },
  {
    key: "navigation",
    label: "Navigation",
    description: "Brand label, menu items, and contact button.",
    fields: [
      text("logoText", "Brand name"),
      text("logoAccent", "Brand punctuation"),
      text("hireLabel", "Contact button"),
      array(
        "links",
        "Menu links",
        [
          text("name", "Label"),
          choice("path", "Page", [
            "/",
            "/services",
            "/resume",
            "/work",
            "/contact",
          ]),
        ],
        { min: 1, max: 5 },
      ),
    ],
  },
  {
    key: "seo",
    label: "SEO & analytics",
    description:
      "Search descriptions, sharing image, and public Google identifiers.",
    fields: [
      text("title", "Default site title"),
      area("description", "Default search description"),
      list("keywords", "Keywords"),
      file("ogImage", "Sharing image"),
      text("ogImageAlt", "Sharing image description"),
      text("googleVerification", "Google verification token", {
        optional: true,
      }),
      text("googleAnalyticsId", "GA4 measurement ID", { optional: true }),
      object("pages", "Page metadata", [
        object("home", "Homepage", pageSeo),
        object("services", "Services", pageSeo),
        object("resume", "Resume", pageSeo),
        object("work", "Projects", pageSeo),
        object("contact", "Contact", pageSeo),
      ]),
    ],
  },
];
export const sectionByKey = Object.fromEntries(
  contentSections.map((section) => [section.key, section]),
);
export function emptyField(field) {
  if (field.type === "array" || field.type === "stringlist") return [];
  if (field.type === "object") return emptyFields(field.fields);
  if (field.type === "number") return 0;
  if (field.type === "select") return field.options[0];
  return "";
}
export function emptyFields(fields) {
  return Object.fromEntries(
    fields.map((field) => [field.key, emptyField(field)]),
  );
}
