import { MongoClient } from "mongodb";
import { randomBytes } from "node:crypto";
import { appendFile, writeFile, access, chmod } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { hashPassword, identityDigest } from "../lib/admin/crypto.js";
import { defaultContent } from "../data/site-defaults.js";
import { contentSchema } from "../lib/content-validation.js";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* deployment environment may supply configuration */
}
const generate = process.argv.includes("--generate");
const reset = process.argv.includes("--reset");
let client;
try {
  if (!process.env.MONGODB_URI || !process.env.DATABASE_NAME)
    throw new Error("Configure MONGODB_URI and DATABASE_NAME first.");
  if (!process.env.ADMIN_AUTH_SECRET) {
    const secret = randomBytes(48).toString("hex");
    await appendFile(
      ".env.local",
      `\n# Private admin identity and CSRF key. Copy to the hosting environment.\nADMIN_AUTH_SECRET=${secret}\n`,
      { mode: 0o600 },
    );
    process.env.ADMIN_AUTH_SECRET = secret;
  }
  await chmod(".env.local", 0o600).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  let username, password;
  if (generate) {
    try {
      await access(".admin-access");
      if (!reset)
        throw new Error(
          "Private access file already exists. Use --reset only if you intend to replace the account.",
        );
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    username = `owner-${randomBytes(8).toString("hex")}`;
    password = randomBytes(24).toString("base64url");
  } else {
    if (!process.stdin.isTTY)
      throw new Error(
        "Use an interactive terminal, or --generate to save random credentials privately.",
      );
    let muted = false;
    const output = new Writable({
      write(chunk, encoding, callback) {
        if (!muted) process.stdout.write(chunk, encoding);
        callback();
      },
    });
    const prompt = createInterface({
      input: process.stdin,
      output,
      terminal: true,
    });
    username = await prompt.question("Private admin username: ");
    muted = true;
    process.stdout.write("Password (at least 16 characters): ");
    password = await prompt.question("");
    process.stdout.write("\nConfirm password: ");
    const confirmation = await prompt.question("");
    process.stdout.write("\n");
    prompt.close();
    if (password !== confirmation) throw new Error("Passwords do not match.");
  }
  if (
    !/^[A-Za-z0-9_.@-]{3,100}$/.test(username) ||
    password.length < 16 ||
    password.length > 128
  )
    throw new Error(
      "Use a 3–100 character username and a 16–128 character password.",
    );
  client = await new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  }).connect();
  const db = client.db(process.env.DATABASE_NAME);
  const existing = await db.collection("admins").findOne({});
  if (existing && !reset)
    throw new Error("An admin account already exists. Nothing was changed.");
  await db
    .collection("admins")
    .createIndex({ identityDigest: 1 }, { unique: true });
  await db
    .collection("admin_sessions")
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db
    .collection("rate_limits")
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection("contacts").createIndex({ createdAt: -1, _id: -1 });
  await db.collection("contacts").createIndex({ status: 1, createdAt: -1 });
  await db.collection("site_content").updateOne(
    { _id: "portfolio" },
    {
      $setOnInsert: {
        content: contentSchema.parse(defaultContent),
        revision: 1,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
  const account = {
    identityDigest: identityDigest(username),
    passwordHash: await hashPassword(password),
    active: true,
    updatedAt: new Date(),
  };
  if (existing) {
    await db
      .collection("admins")
      .updateOne({ _id: existing._id }, { $set: account });
    await db.collection("admin_sessions").deleteMany({});
  } else
    await db
      .collection("admins")
      .insertOne({ ...account, createdAt: new Date() });
  if (generate) {
    const localFile = `Admin login: ${(process.env.SITE_URL || "https://majed-ziara-portfolio.vercel.app").replace(/\/$/, "")}/admin/login\nUsername: ${username}\nPassword: ${password}\n\nPrivate local file. Keep it out of Git and delete it after saving these credentials in your password manager.\n`;
    await writeFile(".admin-access", localFile, {
      mode: 0o600,
      flag: reset ? "w" : "wx",
    });
  }
  console.log(
    generate
      ? "Admin is ready. Credentials saved in the ignored .admin-access file (never printed)."
      : "Admin is ready. Credentials were not saved or printed.",
  );
  console.log(
    "Set ADMIN_AUTH_SECRET from .env.local in the hosting environment before deploying.",
  );
} catch (error) {
  // Never print raw database errors, connection strings, or entered credentials.
  const safeMessages = [
    "Configure ",
    "Private access ",
    "Use --reset",
    "Use an interactive ",
    "Passwords do not match.",
    "Use a ",
    "An admin ",
    "Admin authentication ",
  ];
  console.error(
    safeMessages.some((prefix) => error.message.startsWith(prefix))
      ? error.message
      : "Setup could not finish. Check the database connection and permissions, then try again.",
  );
  process.exitCode = 1;
} finally {
  await client?.close();
}
