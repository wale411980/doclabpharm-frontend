# DocLabPharm web

The DocLabPharm public website and the signed-in dashboards (patient, doctor, pharmacy, lab, admin, super admin), built with Next.js 14.

## How it is organised

- `src/app/(site)/`: the public website. Pages are rendered on the server and cached as static HTML, so they load fast and search engines can read them.
- `src/site/`: website content, components and server-side API reads.
- `src/spa/` and `src/app/app-shell/`: the dashboards. `src/middleware.ts` sends dashboard and sign-in URLs (`/user/*`, `/doctor/*`, `/admin/*`, `/login`, ...) to one page that runs the dashboards app in the browser.
- `src/screens/`, `src/components/`, `src/queries/`, `src/router/`: the dashboards app (React Router, TanStack Query).
- `src/index.css`: Tailwind CSS and the DocLabPharm design tokens (brand colours, Plus Jakarta Sans).

## Run it locally

```bash
cp .env.example .env.local   # then set NEXT_PUBLIC_API_URL to your API
yarn install
yarn dev                     # http://localhost:3000
```

## Build and run in production

```bash
yarn typecheck
yarn build
yarn start                   # or: node .next/standalone/server.js
```

`NEXT_PUBLIC_*` settings are built into the browser code, so set them before `yarn build`.

With Docker:

```bash
docker build -t doclabpharm-web \
  --build-arg NEXT_PUBLIC_API_URL=https://api.doclabpharm.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://doclabpharm.com .
docker run -d -p 3000:3000 --name doclabpharm-web doclabpharm-web
```

Put a reverse proxy (nginx, Caddy or Cloudflare) in front for HTTPS. Do not run `yarn dev` in production.

## Search engines

- `/sitemap.xml` and `/robots.txt` are generated. After going live, submit the sitemap in Google Search Console and Bing Webmaster Tools.
- Dashboards and sign-in pages are excluded from search results.
- Health guides at `/health-checks/...` come from the API's packages and refresh hourly.
