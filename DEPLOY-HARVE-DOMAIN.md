# `harve.ai` — one place for the marketing site, help, and auth callback

## Why Intercom crawled “backpacks” and `/shop/ols`

**Whatever is live at `https://harve.ai` today is not only your `harve-landing` HTML.**  
GoDaddy **Website Builder** / **Online Store** often publishes routes like:

- `/shop/...`
- `/products`, `/categories`, etc.

Intercom’s crawler starts at the **homepage** and **follows links**. If the home page points at a store, Fin will ingest that — hence the weird catalog content.

Your **static repo** (`landing.html`, `support.html`, `auth-callback.html`) only becomes Fin’s source of truth **after** those files are what visitors (and the crawler) actually get at `https://harve.ai/...`.

---

## A. Fix Fin **right now** (5 minutes, no DNS change)

In **Intercom → Knowledge → Sync website → Review pages**:

1. **Uncheck** the whole tree under `https://harve.ai` **or** uncheck only **`/shop`** and anything that isn’t Harve help.
2. Open **Advanced settings → URLs to exclude** → **+ Add**, for example:
   - `https://harve.ai/shop`
   - or a pattern Intercom accepts for “all shop URLs” (depends on UI — sometimes you add multiple lines).

3. Under **Additional URLs**, add only what you want Fin to learn, e.g.:
   - `https://harve.ai/support.html`
   - `https://harve.ai/support/getting-started.html`  
   (Once `/support/` is live and linked, you can often add just `support.html` and let it crawl internal links — **if** your static site is actually deployed and linked from the home page.)

4. Continue **Next → Target → Review** and save.

That stops Fin from treating the GoDaddy store as your product docs.

---

## B. Fix the **domain** “once and for all” (hosting + DNS)

You need **one** clear story:

| URL | What should load |
|-----|------------------|
| `https://harve.ai/` | Your landing (`landing.html` as `index.html` or redirect) |
| `https://harve.ai/support.html` | Help hub |
| `https://harve.ai/support/...` | Help articles |
| `https://harve.ai/auth-callback` | WorkOS / AuthKit return URL for the app |
| `https://harve.ai/privacy.html`, `terms.html` | Legal |

### Option 1 — Stay on GoDaddy hosting

1. **Web hosting** (cPanel / Linux hosting with **FTP**), **not** only “Website Builder” if Builder keeps injecting a store.
2. Upload the contents of `harve-landing/` so:
   - `landing.html` → either rename to **`index.html`** or set **default document** to `landing.html`.
   - Paths match repo: `/support/`, `/support/articles/`, `auth-callback.html` at root.
3. In **Website Builder / Online Store**: **disable** the store or **remove** nav links to `/shop` so the homepage doesn’t send crawlers (and users) into merch.

### Option 2 — **Vercel** (recommended if you’re used to it)

**Step-by-step:** see **`VERCEL.md`** in this folder (`vercel.json` already maps `/` → `landing.html`).

1. Import the Git repo; if the repo root is not `harve-landing`, set **Root Directory** to **`harve-landing`**.
2. In **GoDaddy DNS**, follow the **A/CNAME** records Vercel shows when you add **`harve.ai`** under **Domains**.
3. Pick **one** canonical host (`harve.ai` vs `www`) and redirect the other in Vercel.

### Option 2b — Netlify / Cloudflare Pages

Same idea: connect repo, set publish directory to `harve-landing`, point DNS at the provider’s docs.

### DNS checklist (GoDaddy)

- **A** record `@` → your host IP, **or** **CNAME** `www` → `yourproject.vercel.app` (or similar).
- **No** old parking / forwarding to a random template.
- After changes, wait for propagation (minutes–hours).

**Verify:** Open `https://harve.ai/support.html` in an incognito window — you should see **your** help center, not a generic store.

---

## C. WorkOS (login) redirect URL

The Electron app must use the **same** redirect URI that is allowlisted in the **WorkOS dashboard**.

1. In WorkOS **AuthKit / Redirects**, add (if not already):

   `https://harve.ai/auth-callback`

2. Keep a **development** URI for local testing, e.g.  
   `http://localhost:4174/auth/callback`  
   (only if your dev server actually serves that path).

3. For **production builds** of the app, set the environment variable **`HARVE_REDIRECT_URI`** to  
   `https://harve.ai/auth-callback`  
   (see `harve-overlay` `auth.ts`).

---

## D. Intercom allowed domains

In **Intercom → Settings → Web / Messenger**, allow:

- `harve.ai`
- `www.harve.ai` (if you use it)
- `localhost` (for local testing only)

---

## E. Files in this repo that assume `harve.ai`

- `sitemap.xml`, `robots.txt` — canonical URLs  
- `support/article-urls.txt` — full list for you + Fin  
If your site is **only** on `www.harve.ai`, update those files to match **one** canonical host and add a **301 redirect** from the other.

---

## Summary

| Problem | Fix |
|--------|-----|
| Fin learns shop merch | **Exclude** `/shop` in Intercom; sync only `/support` + add seeds |
| Users don’t see your static site | **Deploy** `harve-landing` to the host that serves `harve.ai` |
| GoDaddy store still on domain | **Disable store** or **stop linking** from home |
| Login redirect wrong | **WorkOS** allows `https://harve.ai/auth-callback` + app **`HARVE_REDIRECT_URI`** |
