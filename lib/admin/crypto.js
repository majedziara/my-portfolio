import {
  createHash,
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const derive = promisify(scrypt);
const params = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
export function authSecret() {
  const value = process.env.ADMIN_AUTH_SECRET;
  if (!value || value.length < 64)
    throw new Error("Admin authentication is not configured.");
  return value;
}
export function identityDigest(username) {
  return createHmac("sha256", authSecret())
    .update(`identity:${username.trim().toLowerCase()}`)
    .digest("hex");
}
export function secretDigest(value) {
  return createHash("sha256").update(value).digest("hex");
}
export function randomToken() {
  return randomBytes(32).toString("base64url");
}
export function csrfFor(token) {
  return createHmac("sha256", authSecret())
    .update(`csrf:${token}`)
    .digest("base64url");
}
export function equalSecret(a, b) {
  if (
    typeof a !== "string" ||
    typeof b !== "string" ||
    a.length > 500 ||
    b.length > 500
  )
    return false;
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await derive(password, salt, 64, params);
  return `scrypt$${salt}$${hash.toString("hex")}`;
}
// A dummy verification follows the same work path for nonexistent accounts.
export async function verifyPassword(password, stored) {
  const [
    ,
    salt = "00000000000000000000000000000000",
    encoded = "0".repeat(128),
  ] = (stored || "").split("$");
  const result = await derive(password, salt, 64, params);
  return Boolean(stored) && equalSecret(result.toString("hex"), encoded);
}
