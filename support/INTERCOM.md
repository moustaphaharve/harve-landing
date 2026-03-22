# Intercom Messenger on the Harve help site

Using **Intercom** (or similar) is a normal choice: inbox, AI (Fin), reliability, and updates are their product—you don’t maintain a second “mini support app.”

## 1. Create the workspace

1. Sign up at [intercom.com](https://www.intercom.com/) (or log in).
2. In **Settings → Web** ([direct link pattern](https://app.intercom.com/a/apps/_/settings/web)): turn **Messenger for Web** **on** until you see a green check.
3. Turn **“Enable user traffic for messenger”** **on** (otherwise requests fail silently).

## 2. Get your Workspace ID (same as App ID)

From your browser URL while in Intercom, e.g.  
`https://app.intercom.com/a/apps/ecahpwf5/home`  
→ Workspace ID is `ecahpwf5` (the segment right after `/apps/`).

## 3. Paste ID into `support.html`

In `support.html`, find:

```js
app_id: "YOUR_INTERCOM_WORKSPACE_ID",
```

Replace `YOUR_INTERCOM_WORKSPACE_ID` with your real ID (keep the quotes).

### EU / Australia data hosting

If Intercom told you your workspace is in **EU** or **Australia**, change `api_base` in the same block:

| Region   | `api_base` |
|----------|------------|
| US       | `https://api-iam.intercom.io` |
| EU       | `https://api-iam.eu.intercom.io` |
| Australia| `https://api-iam.au.intercom.io` |

## 4. Allow your domains

In Intercom, add the domains where the snippet runs (e.g. `harve.ai`, `www.harve.ai`, and `localhost` for local testing). Exact path: **Settings → Installation → Messenger** (or Web), depending on UI version—look for **“allowed domains”** / **security**.

## 5. Fin has “no context” until you add knowledge

The Messenger snippet does **not** ship your Git files to Fin. You must add **Knowledge sources**:

- **Website sync** — Point Intercom at your **live** `https://yoursite/support/...` URLs (Fin crawls the public web, not `localhost`). **Step-by-step:** `support/FIN-SETUP.md`
- **Native articles** — Create articles in Intercom Help Center (best quality for Fin).

Full URL checklist for Harve: `support/article-urls.txt`

## 6. Logged-in app (Electron) later

For **identified** users (signed into Harve), you’ll extend `window.intercomSettings` with `user_id`, `email`, `name`, `created_at` (Unix seconds) and use `Intercom('boot', …)` / `Intercom('update')` per [Intercom’s docs](https://developers.intercom.com/installing-intercom/web/installation). Call `Intercom('shutdown')` on logout.

For **anonymous** visitors (public help only), the snippet in `support.html` is enough: conversations tie to a cookie in the browser.

## Optional: custom widget instead

The repo still contains `help-widget.css` / `help-widget.js` (not loaded by default). Use only if you drop Intercom and want a self-hosted UI again.
