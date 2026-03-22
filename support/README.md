# Harve Help Center (static)

This folder powers **`/support.html`** and nested pages — same visual language as the main landing site.

**Domain, GoDaddy, Fin crawling the wrong pages, WorkOS redirects:** see **`../DEPLOY-HARVE-DOMAIN.md`**.

## Messenger: Intercom (recommended)

Big products use **Intercom** (or Zendesk, Crisp, etc.) because the messenger, inbox, AI (Fin), and help articles are a full product—you’re not on the hook for chat infra, spam, or feature parity.

**Setup:** follow **`support/INTERCOM.md`**. The hub page **`support.html`** already includes Intercom’s official snippet; you only paste your **Workspace ID** where it says `YOUR_INTERCOM_WORKSPACE_ID`.

- Sync or rewrite your static articles into **Intercom Help Center** (or Fin’s sources) so AI answers match your docs.
- **Electron later:** same JS snippet in the app shell, plus `Intercom('boot', { user_id, email, … })` for logged-in users—see Intercom’s web docs.

## Other hosted desks

**Zendesk Guide**, **Help Scout**, **Crisp** are similar tradeoffs. If you switch away from static-only HTML, export/copy article text from this repo and point your site footer to the new URL.

## Optional: self-hosted widget (not default)

**`help-widget.css` + `help-widget.js`** — a local demo UI (keyword matching only). Not loaded by `support.html` anymore; keep as a fallback or delete if you only use Intercom.

## Structure

| Path | Purpose |
|------|---------|
| `/subprocessors` | Third-party subprocessors (transparency / DPA) |
| `/support.html` | Hub + search + category cards + **Intercom snippet** |
| `/support/*.html` | Collection list pages (article rows) |
| `/support/articles/*.html` | Individual articles |
| `support.css` | Shared styles |
| `INTERCOM.md` | How to enable Intercom + Fin on this site |
| `FIN-SETUP.md` | **Why Fin has no context** + website sync vs native articles |
| `INTERCOM-KNOWLEDGE-STEPS.md` | **Exact Fin sync values** + why login can’t be automated from git |
| `article-urls.txt` | Every production help URL (`harve.ai`) — **auto-generated** |
| `intercom-knowledge-seed.html` | **Single crawl entry** for Intercom Fin (lists all article links) |
| `../scripts/generate-intercom-knowledge.mjs` | Run after adding/removing pages to refresh seed + URLs |
| `/sitemap.xml`, `/robots.txt` (site root) | Crawlable list + allow bots (helps Fin website sync) |
| `help-widget.css`, `help-widget.js` | Optional custom launcher (unused) |

Replace placeholder images/videos in `articles/how-to-use-harve.html` and `articles/connect-bank-stripe.html` with product assets when ready.
