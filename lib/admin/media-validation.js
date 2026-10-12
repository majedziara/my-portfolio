import "server-only";
import { ObjectId } from "mongodb";
import { sectionByKey } from "../content-definition";
import { HttpError } from "./http";
function collect(fields, values) {
  return fields.flatMap((field) =>
    field.type === "file"
      ? [{ path: values[field.key], accept: field.accept }]
      : field.type === "object"
        ? collect(field.fields, values[field.key])
        : field.type === "array"
          ? values[field.key].flatMap((item) => collect(field.fields, item))
          : [],
  );
}
export async function verifyMediaReferences(db, section, content) {
  const assets = collect(sectionByKey[section].fields, content);
  const uploaded = assets.filter((asset) =>
    asset.path.startsWith("/api/media/"),
  );
  const files = uploaded.length
    ? await db
        .collection("media.files")
        .find({
          _id: {
            $in: uploaded.map(
              (asset) => new ObjectId(asset.path.split("/").at(-1)),
            ),
          },
          "metadata.public": true,
        })
        .toArray()
    : [];
  for (const asset of assets) {
    if (asset.path.startsWith("/api/media/")) {
      const file = files.find(
        (file) => file._id.toHexString() === asset.path.split("/").at(-1),
      );
      if (
        !file ||
        (asset.accept === "pdf"
          ? file.metadata.contentType !== "application/pdf"
          : file.metadata.contentType !== "image/webp")
      )
        throw new HttpError(
          400,
          "Choose an uploaded file of the correct type.",
        );
    } else if (
      !(
        asset.accept === "pdf"
          ? /\.pdf$/i
          : /\.(png|jpe?g|webp|avif|svg|ico|gif)$/i
      ).test(asset.path)
    )
      throw new HttpError(400, "Choose a file of the correct type.");
  }
}
