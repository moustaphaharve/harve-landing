/**
 * Injects Cloudflare Turnstile *site* key into enterprise.html at build time.
 * Set TURNSTILE_SITE_KEY in Vercel (or CI) — same value as Cloudflare Turnstile "Site Key".
 * Secret key stays only on the API (Railway TURNSTILE_SECRET_KEY).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const file = path.join(root, 'enterprise.html');
const key = (process.env.TURNSTILE_SITE_KEY || '').trim();

function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

let html = fs.readFileSync(file, 'utf8');
const re = /(<meta\s+name="turnstile-site-key"\s+content=")([^"]*)("\s*\/?>)/i;
if (!re.test(html)) {
  console.warn('[inject-turnstile] meta name="turnstile-site-key" not found in enterprise.html');
  process.exit(0);
}
html = html.replace(re, `$1${escAttr(key)}$3`);
fs.writeFileSync(file, html);
if (key) {
  console.log('[inject-turnstile] Site key injected (length ' + key.length + ').');
} else {
  console.log('[inject-turnstile] TURNSTILE_SITE_KEY empty — captcha widget off (set env in Vercel to enable).');
}
