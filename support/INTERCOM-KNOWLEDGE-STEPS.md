# Intercom Fin — sync all Harve help articles (auto)

Your **real** help content lives in this repo (`support/**/*.html`). Intercom cannot log into GitHub; it **crawls public URLs** on `harve.ai`.

## What we added in the repo

| File | Purpose |
|------|---------|
| **`support/intercom-knowledge-seed.html`** | One page with **every** help URL as `<a href>` links. Crawlers + Fin follow these and ingest each article. |
| **`support/article-urls.txt`** | Same URLs (plain list) — for you or scripts. |
| **`scripts/generate-intercom-knowledge.mjs`** | Regenerates the two files when you add/remove HTML pages. |

After adding or renaming help pages, run:

```bash
node scripts/generate-intercom-knowledge.mjs
```

Commit and deploy to Vercel so `harve.ai` updates.

---

## One-time setup in Intercom (≈2 min)

1. Open **Knowledge** → **Sources** → your **Website** / **Harve** source (or **Add content** → **Website**).

2. Set the **root URL** to either:
   - **`https://harve.ai`** — and **restrict paths** to `/support/` (exclude `/shop`, marketing, etc.), **or**
   - **`https://harve.ai/support/intercom-knowledge-seed`** — the seed page alone (Intercom will follow all links).

3. **Additional URLs** (if the UI offers it): paste **`https://harve.ai/sitemap.xml`** so nothing is missed.

4. **Exclude** non-help paths, e.g. `https://harve.ai/shop`, old GoDaddy pages, etc.

5. In **Fin / AI Agent** settings, turn **on** this source for **customer-facing** answers (not only internal Copilot).

6. Wait for sync (can take minutes). Test Fin: *“How do I install Harve?”* — it should cite your install article.

---

## If Fin still shows wrong content

- Confirm **live** `harve.ai` is this repo (not a parked page or store).
- Re-run the generator after content changes, deploy, then **re-sync** or **refresh** the source in Intercom.

---

## Credentials

- **`app_id` in HTML** = public (OK to commit).
- **Intercom API tokens** — never commit; dashboard-only for manual actions unless you add CI with secrets.
