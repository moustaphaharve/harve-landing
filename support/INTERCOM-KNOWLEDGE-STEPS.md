# Fin knowledge — what’s automated vs what only you can click

## If Fin shows “shop” / merch / `/shop/ols`
Your **live** `harve.ai` is probably still GoDaddy **Online Store** or a template that links to `/shop`. Intercom follows those links. **Do not** sync the whole domain unchecked.

1. **URLs to exclude** (Advanced settings): add `https://harve.ai/shop` and any other non‑Harve paths.
2. **Uncheck** the `/shop` branch in the tree.
3. **Additional URLs:** add `https://harve.ai/support.html` (and other `/support/...` pages if needed).
4. Long term: **deploy** this repo’s static site to `harve.ai` and remove/disable the store — see **`../DEPLOY-HARVE-DOMAIN.md`**.

---

## What the repo already has (no Intercom login required)

| Item | Location |
|------|----------|
| Public Messenger `app_id` | `support.html` → `g9nmr6d9` |
| Full URL list for help | `article-urls.txt` |
| **Sitemap** for crawlers / discovery | `/sitemap.xml` at site root |
| **robots.txt** allows indexing | `/robots.txt` |

**I (the AI / CI) cannot log into [app.intercom.com](https://app.intercom.com)** — there is no Intercom **access token** or password in this repo, and Fin “Train content” is **dashboard-only** for security.

---

## What you do once (≈2 minutes) — copy these values

1. **Log in** to Intercom in your browser.

2. Open **Knowledge** / **Sources** / **Train Fin** (wording varies).  
   Quick link (your workspace):  
   `https://app.intercom.com/a/apps/g9nmr6d9/knowledge-hub/overview`  
   If that 404s, use the sidebar: **Knowledge** → **Sources** → **Add content** → **Website**.

3. **Add website** (sync):
   - **URL:** `https://harve.ai`  
   - Include paths under **`/support/`** (and `/support.html` if the UI asks for explicit paths).

4. **Optional:** Paste **`https://harve.ai/sitemap.xml`** anywhere Intercom offers “sitemap” or “seed URLs” (depends on UI version).

5. **Enable for Fin:** In Fin / AI Agent settings, ensure this **Website** source is **on** for customer-facing answers—not only Copilot.

6. Wait for first sync, then ask Fin: *“How do I install Harve?”* — it should cite your install article.

---

## If the site isn’t on `harve.ai` yet

Deploy first, then either:

- Change **`sitemap.xml`**, **`robots.txt`**, and **`article-urls.txt`** to your real domain, **or**
- In Intercom, use **your real origin** in step 3 (e.g. `https://www.harve.ai`).

Use **one canonical host** (redirect `www` ↔ apex) so Fin doesn’t duplicate pages.

---

## Credentials note

- **`app_id` in HTML** = public (normal).
- **Fin / Knowledge** = requires **your** Intercom session; never commit API tokens to git.
