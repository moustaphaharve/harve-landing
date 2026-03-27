# Deploy Harve marketing site on Vercel

This folder is mostly **static** (HTML/CSS). The homepage **Mac demo** is a pre-bundled **`demo-bundle.js`** (React). No Vercel build step is required if you commit `demo-bundle.js`.

**After editing** `src/harve-demo.jsx` or `src/demo-entry.jsx`, run **`npm install`** once, then **`npm run build:demo`** to regenerate `demo-bundle.js`, and commit it.

## 1. Repo layout

- **If this repo’s root is `harve-landing/`**  
  Connect the repo as usual; **Root Directory** stays **`.`** (default).

- **If `harve-landing/` is inside a monorepo**  
  In Vercel: **Settings → General → Root Directory** → set to **`harve-landing`**.

`vercel.json` rewrites **`/` → `/landing.html`** so the homepage works without renaming files.

### Clean URLs (no `.html` in the bar)

Vercel **rewrites** map pretty paths to the real files, e.g. **`/privacy`** → `privacy.html`, **`/support/articles/install-harve`** → `…/install-harve.html`. **301 redirects** send old `*.html` links to the short form for SEO.

OAuth **must** use the slash form WorkOS expects, e.g. **`https://www.harve.ai/auth/callback`** (same behavior as `/auth-callback` and `auth-callback.html`). The repo serves it via **`auth/callback/index.html`** (static path) plus `vercel.json` rewrites so Vercel cannot miss the route.

## 2. New project

1. [vercel.com](https://vercel.com) → **Add New… → Project** → Import your Git repo.
2. **Framework Preset:** Other (or “No framework”).
3. **Build Command:** leave **empty** (not needed).
4. **Output Directory:** leave default / `.` — Vercel serves files from the project root.
5. **Deploy.**

After deploy you get a URL like `https://harve-landing-xxx.vercel.app`. Click through `/`, `/support`, `/auth-callback`.

## 3. Connect `harve.ai` (GoDaddy DNS)

1. Vercel project → **Settings → Domains** → add **`harve.ai`** and **`www.harve.ai`** (optional).
2. Vercel will show **DNS records** to add (usually **A** for apex `@` and **CNAME** for `www` pointing at `cname.vercel-dns.com` or similar — follow the live UI; it changes).
3. In **GoDaddy** → your domain → **DNS**:
   - Remove or replace conflicting **A** / **CNAME** records for `@` and `www` that pointed to old hosting (e.g. parked page / Website Builder).
4. Wait for DNS (often minutes, sometimes up to 48h). Vercel shows **Valid** when SSL is ready.

**Canonical host:** pick either **apex** (`harve.ai`) or **`www`** as primary; in Vercel add a **redirect** from the other to the primary (Domains UI).

## 4. After the domain works

| Task | Where |
|------|--------|
| WorkOS redirect | **`https://www.harve.ai/auth/callback`** (exact; must match app + dashboard) |
| Electron app | Production default is `https://www.harve.ai/auth/callback` in `harve-overlay` `auth.ts`; override only with **`HARVE_REDIRECT_URI`** if needed |
| Intercom Fin | Re-sync website; **exclude** `/shop` if old host had a store; seed **`/support`** |
| `sitemap.xml` / `robots.txt` | Already use `https://harve.ai` — no change if that’s your canonical URL |

## 5. Optional: preview deployments

Every PR gets a preview URL — useful to check before promoting to production.

## Local dev vs Vercel

| Local | Production |
|-------|------------|
| `node server.js` may map `/auth/callback` → file | Use **`https://harve.ai/auth-callback`** in WorkOS + app env |

---

**Note:** `server.js` is only for local testing; Vercel does not run it. Static files + `vercel.json` rewrites are enough.
