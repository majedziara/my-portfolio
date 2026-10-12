import { emailLink } from "../lib/links.js";
import test from "node:test";
import assert from "node:assert/strict";
import { contentSchema, validateSection } from "../lib/content-validation.js";
import { defaultContent } from "../data/site-defaults.js";
import {
  csrfFor,
  equalSecret,
  hashPassword,
  identityDigest,
  randomToken,
  secretDigest,
  verifyPassword,
} from "../lib/admin/crypto.js";
process.env.ADMIN_AUTH_SECRET = "a".repeat(96);
test("bootstrap content includes every editable section and validates", () => {
  assert.deepEqual(contentSchema.parse(defaultContent), defaultContent);
});
test("rejects extra fields and Mongo operators", () => {
  assert.throws(() =>
    validateSection("profile", {
      ...defaultContent.profile,
      passwordHash: "not allowed",
    }),
  );
  assert.throws(() =>
    validateSection("profile", {
      ...defaultContent.profile,
      name: { $ne: "" },
    }),
  );
  assert.throws(() => validateSection("not-a-section", {}));
});
test("blocks script URLs, remote assets, traversal, and invalid analytics IDs", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "",
  ])
    assert.throws(() =>
      validateSection("profile", { ...defaultContent.profile, github: url }),
    );
  for (const path of [
    "/assets/../private",
    "//example.com/test.png",
    "https://example.com/test.png",
    "/api/admin/session",
  ])
    assert.throws(() =>
      validateSection("home", { ...defaultContent.home, photoUrl: path }),
    );
  assert.throws(() =>
    validateSection("seo", {
      ...defaultContent.seo,
      googleAnalyticsId: "G-ID';alert(1)",
    }),
  );
});
test("blank optional project links are valid and line lists normalize safely", () => {
  assert.equal(
    validateSection("work", defaultContent.work).projects[0].live,
    "",
  );
  const result = validateSection("seo", {
    ...defaultContent.seo,
    keywords: ["Laravel", "", "  ", "Next.js"],
  });
  assert.deepEqual(result.keywords, ["Laravel", "Next.js"]);
  assert.throws(() =>
    validateSection("seo", { ...defaultContent.seo, keywords: [1] }),
  );
});
test("rejects duplicate project numbers, duplicate navigation and invalid service identifiers", () => {
  assert.throws(() =>
    validateSection("work", {
      ...defaultContent.work,
      projects: [
        defaultContent.work.projects[0],
        defaultContent.work.projects[0],
      ],
    }),
  );
  assert.throws(() =>
    validateSection("navigation", {
      ...defaultContent.navigation,
      links: [
        defaultContent.navigation.links[0],
        defaultContent.navigation.links[0],
      ],
    }),
  );
  assert.throws(() =>
    validateSection("contact", {
      ...defaultContent.contact,
      serviceOptions: [{ value: "$set", label: "Bad choice" }],
    }),
  );
});
test("empty collections are supported while required profile fields stay required", () => {
  assert.deepEqual(
    validateSection("work", { heading: "Work", projects: [] }).projects,
    [],
  );
  assert.throws(() =>
    validateSection("profile", { ...defaultContent.profile, name: " " }),
  );
  assert.throws(() =>
    validateSection("home", {
      ...defaultContent.home,
      statistics: [{ num: -1, suffix: "", text: "Invalid" }],
    }),
  );
});
test("private identity digests need the server secret and never contain the username", () => {
  const username = "Owner-Test";
  assert.equal(identityDigest(username), identityDigest("owner-test"));
  assert(!identityDigest(username).includes(username));
  const before = identityDigest(username);
  process.env.ADMIN_AUTH_SECRET = "b".repeat(96);
  assert.notEqual(identityDigest(username), before);
  process.env.ADMIN_AUTH_SECRET = "a".repeat(96);
});
test("sessions and CSRF tokens are unpredictable and bound to the specific session", () => {
  const a = randomToken(),
    b = randomToken();
  assert.match(a, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(a, b);
  assert.notEqual(secretDigest(a), a);
  assert.notEqual(csrfFor(a), csrfFor(b));
  assert.equal(equalSecret(csrfFor(a), csrfFor(a)), true);
  assert.equal(equalSecret(csrfFor(a), csrfFor(b)), false);
  assert.equal(equalSecret("", undefined), false);
  assert.equal(equalSecret("x", "xx"), false);
});
test("scrypt salts passwords and rejects incorrect and nonexistent accounts", async () => {
  const password = "A-long-password-used-only-in-tests!";
  const hash = await hashPassword(password);
  assert(!hash.includes(password));
  assert.notEqual(hash, await hashPassword(password));
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword("wrong", hash), false);
  assert.equal(await verifyPassword(password, undefined), false);
});

test("email links cannot inject BCC or other mailto parameters", () => {
  assert.equal(emailLink("reader@example.com"), "mailto:reader@example.com");
  assert.equal(
    new URL(emailLink("reader@example.com?bcc=leak%40example.com")).search,
    "",
  );
  assert(
    emailLink("reader@example.com?bcc=leak%40example.com").includes("%3F"),
  );
});
