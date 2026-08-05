# pf-clone-2

Personal portfolio site, built with Next.js 16 and a Keystatic-backed CMS for projects.

## Commands

```bash
npm run dev -- -p 4577   # Start dev server (port 4577 — 3000 is occupied on this machine)
npm run build            # Production build
npm run lint             # ESLint check
npm run typecheck        # TypeScript check
npm run check            # Run lint + typecheck + build
```

## CMS

Projects are managed via Keystatic at `/keystatic` while the dev server is running.
Content lives in `content/projects/`, assets in `public/images/projects/` — both git-tracked.

Always add or edit media through the Keystatic UI rather than by hand-editing JSON; it
chooses its own storage paths, and hand-written ones silently break the admin UI.

## Docs

- `docs/ROADMAP.md` — current priorities and parked work
- `docs/research/PAGE_TOPOLOGY.md` — reference notes on the original site
- `AGENTS.md` — architecture, conventions, and CMS gotchas
