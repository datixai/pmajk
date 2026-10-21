<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev`; verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Prime Minister of AJK website

Redesign of ajkpm.gok.pk with a built-in admin panel. Read `README.md` first, then `docs/SECURITY.md` before touching auth, uploads or headers.

- Content lives in `data/content.json` (seeded from `data/seed.json`); edit fields in `src/lib/schema.ts`.
- Every admin server action must call `requireUser()` first.
- Never render raw HTML from content. Never use the em dash or en dash characters in copy. Write AJK and JK, not the ampersand forms.
