# Majed Ziara — Portfolio

Personal portfolio for Majed Ziara, a Laravel backend and full-stack engineer based in Gaza, Palestine and available for remote work.

## Professional focus

- Laravel applications, REST APIs, authentication, permissions, queues, events, and notifications
- Business workflows, payments, webhooks, invoicing, and third-party integrations
- Next.js, React, TypeScript, Tailwind CSS, responsive UI, SEO, and Arabic/English experiences
- MySQL, PostgreSQL, Redis, Git/GitHub, Linux VPS, Nginx, and production support

## Featured work

- Enjoy Games digital store — Laravel backend, order fulfillment, Paymob KSA, Zoho Books, wallet, points, and operational workflows
- Emtedad Charity Platform — bilingual Laravel and Next.js charity-management platform
- DIGO Internal Management System — attendance, leave, payroll, finance, employee records, and reporting
- Khota Educational Center — responsive Next.js website with motion and SEO
- DIGO multilingual website — Next.js App Router, TypeScript, next-intl, and RTL/LTR support

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## SEO and deployment

Each page includes its own title, description, canonical URL, Open Graph metadata, and Twitter card. Shared configuration is in `lib/seo.js`. The site includes structured data, `/robots.txt`, `/sitemap.xml`, a 1200 × 630 sharing image, and custom site icons.

The canonical domain defaults to `https://majed-ziara-portfolio.vercel.app`. Set `SITE_URL` in your hosting environment before building if you use a different domain. Update the domain printed in the sharing image when changing it.

After deploying:

1. Open Google Search Console for the production URL and click **Verify**. Both the supplied verification meta tag and `/googledb9beca33381b118.html` are installed.
2. Submit `https://majed-ziara-portfolio.vercel.app/sitemap.xml` under **Sitemaps**, using your actual domain if it differs.
3. Inspect the homepage and key pages with **URL inspection**, then request indexing.

Keywords are included as requested; [Google does not use the keywords meta tag for indexing or ranking](https://developers.google.com/search/docs/crawling-indexing/special-tags). Titles, descriptions, crawlable content, and performance receive the main attention. Deployment and verification do not guarantee a ranking or immediate indexing.

Copy `.env.example` to `.env.local` for local configuration. Configure `MONGODB_URI` and `DATABASE_NAME` for real contact submissions. Vercel Analytics runs when deployed on Vercel.

Run `npm run lint` and `npm run build` before deploying. Measure Lighthouse against `npm run start`, since development mode includes extra scripts and compilation overhead.

See [the SEO, performance, and accessibility verification report](docs/seo-performance.md) for measured results, asset reductions, and remaining checks after deployment.

## Contact

- Email: [majedziyara@gmail.com](mailto:majedziyara@gmail.com)
- Portfolio: [majed-ziara-portfolio.vercel.app](https://majed-ziara-portfolio.vercel.app/)
- LinkedIn: [linkedin.com/in/majedziara](https://www.linkedin.com/in/majedziara/)
- GitHub: [github.com/majedziara](https://github.com/majedziara/)
