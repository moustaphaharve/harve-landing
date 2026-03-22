# Give Fin context (Harve help content)

Fin does **not** read files from GitHub or your laptop. It only uses what you add under **Intercom → Knowledge** (native articles, snippets, and/or **synced websites**).

You already have **~35 HTML pages** in this repo. You fix “no context” by connecting that **live site** to Intercom, or by publishing the same text as **Intercom articles**.

## Already done in this repo (automatable part)

- **`/sitemap.xml`** — lists every help URL under `https://harve.ai/...` for crawlers (and for you to paste into Intercom if offered).
- **`/robots.txt`** — allows crawlers; points to the sitemap.
- **`article-urls.txt`** — same URLs as plain text for manual checks.

**Intercom’s dashboard** (add website + enable for Fin) still requires **your** login — see **`INTERCOM-KNOWLEDGE-STEPS.md`** for exact values to paste.

---

## Option A — Website sync (fastest if the site is public)

**Requirement:** Your help pages must be reachable on the **real internet** (Fin cannot crawl `localhost` or private builds).

1. **Deploy** `harve-landing` so URLs work, e.g.  
   `https://YOUR_DOMAIN/support.html`  
   `https://YOUR_DOMAIN/support/getting-started.html`  
   (Use your real domain; see `article-urls.txt` in this folder for every path.)

2. In Intercom, open **Knowledge** (or **Fin → Train / Content** — product UI changes, search for **“Sources”** or **“Add content”**).

3. **Add source → Website** (or **Sync website**).

4. Enter your **base URL**, e.g. `https://YOUR_DOMAIN/` and follow prompts to **include** paths under `/support/` and `/support/articles/`.

5. **Save / Start sync.** First ingestion can take a while; some plans refresh on a schedule (e.g. ~24h). Check the Knowledge overview until pages show as indexed.

6. In **Fin / AI Agent** settings, confirm **Website** (or the new source) is **turned on** for Fin—not only for Copilot or internal use.

7. Test in the Messenger: ask something that appears verbatim in an article (e.g. “How do I install Harve?”).

**Tips**

- If Fin ignores pages, check **allowed domains** for Messenger and any **crawl / robots** rules that might block Intercom’s fetcher.
- **Native Intercom articles** still get the fastest, most reliable Fin behavior; use sync to bootstrap, then move high-traffic topics into Articles later.

---

## Option B — Native Help Center articles (best quality)

1. **Help Center → Articles → New article.**

2. For each topic, copy the **title + body** from the matching file under `support/articles/*.html` (or write a shorter version).

3. **Publish** each article and assign **collections** (Getting started, Billing, etc.).

4. In **Fin → Content / Sources**, ensure **Public articles** are enabled for Fin.

Best for: polished search inside Intercom, fewer crawl surprises.

---

## Option C — Hybrid

- Sync **Website** for full coverage on day one.
- Over time, replace high-value pages with **native articles** and refine Fin behavior.

---

## Your URL list

See **`article-urls.txt`** — replace `https://YOUR_DOMAIN` with your real origin before sharing or checking links.

---

## After it works

- Re-sync or republish when you change help HTML.
- Add **Fin behavior** rules in Intercom (when to escalate to humans, tone).
- Optional: **Identity verification** for logged-in app users (separate from public help).
