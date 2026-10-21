# Security

The website of the Prime Minister is a target. This build applies defence in depth: every layer assumes the one before it may fail.

## Built into the application

**Admin access**
- Passwords hashed with scrypt and a random salt; never stored or logged in plain text.
- Strong password rule: 12+ characters using three of lower case, upper case, numbers and symbols.
- **Two-factor login** (TOTP, works with Google or Microsoft Authenticator). The dashboard warns every user who has not turned it on. Between the password and the code step only a 5-minute signed marker is kept, never the password.
- Brute-force protection: 5 failed attempts per account or 20 per IP address lock sign-in for 15 minutes. Unknown emails take the same time to check as real ones, so accounts cannot be discovered by timing.
- Sessions: HMAC-signed, `HttpOnly`, `SameSite=Strict`, `Secure` in production, 8-hour lifetime. In production the cookie uses the `__Host-` prefix, so the browser refuses it unless it is Secure and set for this exact host (a subdomain cannot plant or read it). Changing the password or using "Sign out everywhere" ends every other session immediately.
- Roles: **administrator** (everything, including users) and **editor** (content only). The last administrator cannot be removed.
- Every page and every server action checks the session on the server. The proxy redirect is only a first, optimistic check.
- **Activity log** of every sign-in, failed sign-in (with IP), upload, edit, reorder and deletion.

**Content and uploads**
- No raw HTML is ever rendered from content; React escapes everything. The text editor supports only paragraphs, sub-headings and bullets.
- Uploads: JPG, PNG, WebP, GIF and PDF only, checked by their actual file signature (not the name), 10 MB limit, random file names, stored outside the public folder and served with `nosniff`. SVG, HTML and Office files are refused (tested: an HTML file renamed to `.jpg` is rejected). Path traversal is blocked.
- Image and document fields only accept files from this site's own library (`/images/...` or `/media/...`); outside addresses and `..` are refused.
- All form input is length-limited and validated on the server (URLs, dates, YouTube links, options).
- Contact form: honeypot field against bots and a rate limit of 5 messages per 10 minutes per IP.

**Scanners and old WordPress addresses**
- Requests for WordPress and other software paths (`wp-login.php`, `xmlrpc.php`, `wp-admin`, `wp-json`, `.env`, `.git`, `phpmyadmin`) get a plain 404, so automated scanners learn nothing and are never pointed to the real admin panel.
- No public user list, no version banners, no `readme.html`, no directory listings.
- `/.well-known/security.txt` tells researchers how to report a problem privately.

**Browser protection (HTTP headers)**
- Content Security Policy with a fresh nonce per request: only this site's own scripts can run, so injected spam or malicious scripts (like those found on the current site) are blocked. The privacy-enhanced YouTube player is the only allowed frame. No third-party scripts, fonts or social media widgets are loaded.
- `Strict-Transport-Security` (2 years, preload) in production.
- `X-Frame-Options: DENY` and `frame-ancestors 'none'` against clickjacking.
- `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`.
- No `X-Powered-By` header. Admin pages are `no-store` and `noindex`.

**Dependencies**
- Unused template packages removed. `npm audit --omit=dev` reports 0 known vulnerabilities (22 October 2026). Run it monthly.

## Needed at hosting level (cannot be done in application code)

No website code can stop a large distributed denial-of-service (DDoS) attack on its own. Before going live:

1. **Put the site behind a CDN / web application firewall** (for example Cloudflare, or the government's own WAF) with DDoS protection, bot management and rate limiting turned on.
2. **HTTPS only**, with a valid certificate; submit the domain to the HSTS preload list.
3. **Restrict `/admin`** to the government network or a VPN at the firewall, in addition to the login and two-factor code.
4. Run the app as an unprivileged user; keep the server and Node.js patched.
5. **Daily encrypted backups** of the `data/` folder (or the database) kept off-site, and a tested restore procedure.
6. Move content to a managed database (PostgreSQL) and file storage when more than one server is used. Only `src/lib/store.ts` needs to change.
7. Keep `.env.local` secrets out of version control; use a long random `SESSION_SECRET` and rotate it if it may have leaked (this signs everyone out).
8. Uptime and security monitoring with alerts; review the activity log weekly.
9. An independent penetration test before launch.
10. On the current WordPress server, right away: delete the planted spam file (`/wp-content/uploads/2023/04/new-2.txt`, `new-2-1.txt`) and the exposed spreadsheet (`/wp-content/uploads/2022/10/EMIS_Latest.xlsx`), change every WordPress password, disable `xmlrpc.php` and the public user list, and check the server for other planted files.
