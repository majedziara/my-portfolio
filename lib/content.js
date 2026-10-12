import "server-only";
import { cache } from "react";
import { getMongoClient } from "./mongodb";
import { defaultContent } from "@/data/site-defaults";
import { contentSchema } from "./content-validation";

export async function getDatabase() {
  if (!process.env.DATABASE_NAME)
    throw new Error("Database configuration is missing.");
  return (await getMongoClient()).db(process.env.DATABASE_NAME);
}
export const getContentDocument = cache(async () => {
  const db = await getDatabase();
  // Seed once; existing content is never overwritten by a deploy.
  let document = await db
    .collection("site_content")
    .findOne({ _id: "portfolio" });
  if (!document) {
    await db
      .collection("site_content")
      .updateOne(
        { _id: "portfolio" },
        {
          $setOnInsert: {
            content: defaultContent,
            revision: 1,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    document = await db
      .collection("site_content")
      .findOne({ _id: "portfolio" });
  }
  return {
    content: contentSchema.parse(document.content),
    revision: document.revision,
    updatedAt: document.updatedAt,
  };
});
export const getSiteContent = cache(async () => {
  if (!process.env.MONGODB_URI || !process.env.DATABASE_NAME)
    return defaultContent;
  return (await getContentDocument()).content;
});
