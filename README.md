# Prime Minister of Azad Jammu & Kashmir (website redesign concept)

A redesign of the website of the Prime Minister's Office, Azad Government of the State of Jammu & Kashmir (ajkpm.gok.pk), built as a pitch. It keeps every piece of information and every photo from the current site, fixes its security, content and broken-link problems, and adds a complete, secure content management (admin) panel.

Built with Next.js 16.4 (App Router), React 19, TypeScript and Tailwind CSS 4.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the port shown). The admin panel is at `/admin`.

The first admin account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` (see `.env.example`; put the password in double quotes if it contains `#`). After the first sign-in the password is stored only as a hash in `data/users.json`. Change it and turn on two-factor login from **My account**.

Production build:

```bash
npm run build
npm start
```

## Pages

| Address | Page |
| --- | --- |
| `/` | Home: the Prime Minister, mission and vision, priorities, newsroom, the Kashmir cause, cabinet, gallery, Complaint Portal |
| `/prime-minister` | Profile, mission and vision, former Prime Ministers since 1975 |
| `/cabinet` | The AJK Cabinet |
| `/pm-office` | Organogram of the Prime Minister's Secretariat and the political wing |
| `/newsroom`, `/newsroom/[slug]` | Press releases |
| `/notifications` | Official notifications (image or PDF) |
| `/gallery` | Photo albums with a full-screen viewer |
| `/videos` | YouTube videos (play on click, privacy-enhanced player) |
| `/ajk-at-a-glance` | Key figures, history and timeline |
| `/kashmir-cause` | The Kashmir cause |
| `/contact` | Contact details and a secure contact form |
| `/search` | Site search |

Old addresses of the WordPress site redirect to the new pages.

## What is where

| Path | What it is |
| --- | --- |
| `src/app/(site)` | Public pages |
| `src/app/admin` | Admin panel: dashboard, every content section, media library, messages, settings, users, activity log, account |
| `src/app/admin/actions.ts` | All admin server actions (every one checks the signed-in user) |
| `src/lib/schema.ts` | Field definitions for every editable section. Add a field here and it appears in the admin form |
| `src/lib/store.ts` | Content store (JSON file). Swap for PostgreSQL without touching the pages |
| `src/lib/auth.ts`, `src/lib/totp.ts` | Sessions, passwords, lockouts and two-factor login |
| `src/proxy.ts` | Content Security Policy with per-request nonce, admin protection, scanner blocking |
| `data/seed.json` | Starting content (copied to `data/content.json` on first run) |
| `data/uploads/` | Files uploaded in the admin panel (served from `/media/...`) |
| `docs/PITCH_REPORT.md` | Problems found on the current site and how this version fixes them |
| `docs/SECURITY.md` | Security measures and the hosting checklist |
| `docs/IMAGE_CREDITS.md` | Where every photo comes from |

To reset the demo content, stop the server and delete `data/content.json`; it is recreated from `seed.json`.
