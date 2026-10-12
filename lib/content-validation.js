import { z } from "zod";
import { contentSections } from "./content-definition.js";

export const assetPath = z
  .string()
  .max(300)
  .refine(
    (value) =>
      !value.includes("..") &&
      (/^\/assets\/[A-Za-z0-9_./ -]+$/.test(value) ||
        /^\/[A-Za-z0-9_-]+\.(?:png|webp|svg|ico|jpg|jpeg)$/.test(value) ||
        /^\/api\/media\/[a-f0-9]{24}$/.test(value)),
    "Choose a local asset or an uploaded file.",
  );
function fieldSchema(field) {
  if (field.type === "object") return fieldsSchema(field.fields);
  if (field.type === "array")
    return z
      .array(fieldsSchema(field.fields))
      .min(field.min ?? 0)
      .max(field.max ?? 50);
  if (field.type === "stringlist")
    return z.preprocess(
      (value) =>
        Array.isArray(value)
          ? value.filter((item) => typeof item !== "string" || item.trim())
          : value,
      z.array(z.string().trim().min(1).max(160)).max(60),
    );
  if (field.type === "number")
    return z
      .number()
      .int()
      .min(0)
      .max(field.max ?? 1000000);
  if (field.type === "select") return z.enum(field.options);
  if (field.type === "file") return assetPath;
  if (field.type === "email") return z.email().max(254);
  if (field.type === "url") {
    const url = z
      .url()
      .max(1000)
      .refine((value) => {
        try {
          return new URL(value).protocol === "https:";
        } catch {
          return false;
        }
      }, "Use an HTTPS URL.");
    return field.optional ? z.union([url, z.literal("")]) : url;
  }
  let schema = z
    .string()
    .trim()
    .min(field.optional ? 0 : 1)
    .max(field.max ?? 500);
  if (field.key === "googleAnalyticsId")
    schema = schema.refine(
      (value) => !value || /^G-[A-Z0-9]{5,20}$/.test(value),
      "Enter a GA4 measurement ID.",
    );
  if (field.key === "googleVerification")
    schema = schema.regex(/^[A-Za-z0-9_-]*$/);
  return schema;
}
function fieldsSchema(fields) {
  return z
    .object(
      Object.fromEntries(
        fields.map((field) => [field.key, fieldSchema(field)]),
      ),
    )
    .strict();
}
export const sectionSchemas = Object.fromEntries(
  contentSections.map((section) => [section.key, fieldsSchema(section.fields)]),
);
export const contentSchema = z.object(sectionSchemas).strict();
export function validateSection(key, input) {
  const schema = sectionSchemas[key];
  if (!schema) throw new Error("Unknown content section.");
  const data = schema.parse(input);
  const unique = (items, property) =>
    new Set(items.map((item) => item[property])).size === items.length;
  if (key === "work" && !unique(data.projects, "num"))
    throw new Error("Project numbers must be unique.");
  if (key === "navigation" && !unique(data.links, "path"))
    throw new Error("Each menu page can appear only once.");
  if (
    key === "contact" &&
    (!unique(data.serviceOptions, "value") ||
      data.serviceOptions.some(
        (item) => !/^[a-z0-9-]{1,100}$/.test(item.value),
      ))
  )
    throw new Error(
      "Service identifiers must be unique lowercase letters, numbers, or hyphens.",
    );
  return data;
}
