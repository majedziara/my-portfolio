# Portfolio dashboard

## Using it

Open `/admin/login`. Once signed in, `/admin` has links to:

- **Messages:** every existing contact submission, including older submissions without a status. Search, filter, paginate, open the complete message, reply using your email app, and mark it new, read, or archived. No messages are deleted.
- **Profile & contact:** shared name, title, biography, contact details, social links, languages, and nationality.
- **Homepage:** introduction, portrait, portrait description, CV, and animated statistics.
- **Resume & skills:** all introductions and tab labels, experience, education, skill names/icons, and about details. About fields can reference the shared profile or use a custom value.
- **Services / Projects:** add, edit, remove, and reorder entries. Projects include images, stack, and live/repository links.
- **Contact page:** headings, descriptions, field labels, service choices, and confirmation copy.
- **Navigation:** brand text, navigation labels/order, and contact button.
- **SEO & analytics:** titles and descriptions per page, keywords, sharing image, verification token, and GA4 ID.
- **Media library:** upload images and CV PDFs, copy their paths, and delete unused uploads. Images are converted to WebP and limited to 2000 pixels. Uploads are limited to 4 MB and stored in MongoDB GridFS. SVG/HTML uploads are rejected. Choose a 1200 × 630 image for social sharing.
- **Security:** change the password and optionally the username. This revokes all sessions, including the current one.

Choose **Save changes** to publish. Unsaved changes prompt before leaving. A revision conflict requires explicitly reloading the latest saved content instead of silently overwriting another session.

## Initial access

The generated local account is stored in the ignored `.admin-access` file with owner-only permissions. Open it locally, save the credentials in your password manager, then delete the file. It is never imported by the application or served to visitors.

Set these **server-only** variables locally and in the hosting environment:

- `MONGODB_URI`
- `DATABASE_NAME`
- `ADMIN_AUTH_SECRET` — use the same generated value from `.env.local` in production; do not add a `NEXT_PUBLIC_` prefix.
- `SITE_URL` — the canonical public HTTPS origin.

The database is already initialized by the setup command. Future deployments preserve existing content. Original public content in `data/site-defaults.js` is only the initial seed; public pages read the validated MongoDB document on the server. React deduplicates content reads within the request, and MongoDB connections use a shared pool. Public URLs and the existing styles and animation settings are retained.

To create the account on a new database:

```sh
npm run admin:setup
```

This prompts for a username and a password of at least 16 characters without printing or saving them. To generate random credentials and save them locally instead:

```sh
npm run admin:setup -- --generate
```

The setup creates indexes, initializes content without overwriting an existing document, and creates one admin. It refuses to replace an existing account unless you explicitly request a reset:

```sh
npm run admin:setup -- --reset
```

A reset changes the account and revokes sessions. Run these commands from a private terminal with database access. Credentials are never command-line arguments. Node.js 22.7+ is required for the setup script.

## Storage and access controls

- `site_content`: validated public content, revision, and actual update date. Sitemap dates use this update date instead of changing on each build.
- `contacts`: contact messages and statuses. Only authenticated server pages can list them; the public endpoint only creates messages.
- `admins`: a keyed HMAC of the username and a salted scrypt password hash. The plaintext username is not stored in MongoDB.
- `admin_sessions`: SHA-256 digests of random session tokens, expiry, and a credential version. Session cookies contain only the random token and are HttpOnly, SameSite=Strict, and Secure in production. Expired, disabled, revoked, and pre-password-change sessions are rejected. Sessions expire after eight hours.
- `rate_limits`: atomic limits shared between server instances, with TTL cleanup. Login uses global, client, and identity limits. Contact submissions have limits and a honeypot. Client addresses are accepted only from Vercel's trusted proxy header when running on Vercel; other hosts use a shared origin bucket unless a trusted deployment-specific resolver is added.
- `media.files` / `media.chunks`: only explicitly public website uploads. Contact messages and credentials are never served by the media endpoint.

Every private page and endpoint verifies the database session. Mutations also require the same Origin and a session-bound CSRF token. Login errors do not reveal whether a username exists. Sensitive forms use POST even without JavaScript, so credentials are never submitted in a query string. JSON/multipart bodies are size-limited; content schemas reject extra fields and Mongo operators. Links use HTTPS; asset paths are restricted to local public assets and uploaded media. Uploaded images are decoded and re-encoded, and PDFs are served as attachments with `nosniff`.

The public and dashboard areas use separate root layouts. Crossing between them performs a full document load, so public Google/Vercel analytics do not remain active in the dashboard. Admin pages have noindex metadata and headers, no-store responses, and are excluded from robots and the sitemap. These directives supplement authentication; they do not protect private data by themselves.

As with any login form, the owner supplies their credentials through their browser when signing in. The application exposes no account username in HTML, JavaScript bundles, API responses, or public content. Use HTTPS on the deployed site and a password manager; no implementation can promise protection against a compromised owner device or hosting account.

Do not commit `.env.local` or `.admin-access`. `.env.example` contains configuration names only. Changing `ADMIN_AUTH_SECRET` changes identity digests, so reset the account with the new secret if rotating it.

## Checks

Verified locally on 2026-10-12 using an isolated MongoDB database. Public pages passed at 320, 375, and 1280 pixels. Login and dashboard pages passed at mobile and desktop widths, including the message dialog, with no detected axe violations. Browser checks covered unauthorized reads/mutations, login, secure cookie attributes, uniform credential errors, CSRF and Origin rejection, all content sections, stale revision conflicts, contact submission/status updates, GridFS image/PDF uploads, media type/reference validation, used-file deletion protection, session persistence after restart, credential changes/revocation, logout, and login throttling. Test databases were removed after checks; live contact data was not altered.

Uploads are capped at 4 MB so multipart requests stay below [Vercel's 4.5 MB function payload limit](https://vercel.com/docs/functions/limitations). Streaming media reads preserve public cache and content-type headers. Images use WebP; PDF responses are attachments.

Run `npm test`, `npm run lint`, and `npm run build`. Test login, content saves, media uploads, and a contact submission on the deployed HTTPS site after configuring its environment variables. Do not publish local test contacts or test credentials.
