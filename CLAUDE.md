# YPGB Website

Payload CMS 3 + Next.js (App Router) + Tailwind CSS v4 + shadcn/ui. Package manager: pnpm. Database: Postgres 16.

## Running

- `docker compose up -d` starts `postgres` + `app` (dev server with hot reload on http://localhost:3000). Logs: `docker compose logs -f app`.
- The app container bind-mounts this folder; its Linux `node_modules`, `.next` and pnpm store live in named volumes. After changing dependencies, restart the app container (`docker compose restart app`) so it reinstalls.
- In the container, `next dev` runs with `--webpack` + polling (`WATCH_POLL_INTERVAL_MS`), because Windows bind mounts don't deliver file events and Turbopack's polling didn't pick up changes.
- `.env` holds `POSTGRES_*`, `PAYLOAD_SECRET`, and a host-side `DATABASE_URL` (localhost:5432) for running `pnpm payload …` outside Docker; compose overrides `DATABASE_URL` to host `postgres` for the app container.
- `Dockerfile` target `runner` builds a standalone production image (not yet exercised).

- Frontend lives in `src/app/(frontend)`; Tailwind and the shadcn theme are imported only via `src/app/(frontend)/styles.css`, so they don't leak into the Payload admin (`src/app/(payload)`).
- shadcn uses the `base-nova` preset (Base UI primitives, not Radix). Add components with `pnpm dlx shadcn@latest add <name>`.
- After changing collections/fields run `pnpm generate:types`; after adding custom admin components run `pnpm generate:importmap`.

## Design system (Gembala Baik)

Brand rules come from the `gembala-baik-design` skill, adapted to shadcn. Theme lives in `src/app/(frontend)/styles.css`. Project decisions that override the skill:

- **Colors:** shadcn semantic tokens are mapped to the brand (`primary` wheat gold + umber text, `background` parchment, `foreground` umber, `muted`/`secondary`/`accent` soft sand, `ring` wax seal). Use shadcn tokens first; extra brand utilities: `bg-brand` / `bg-brand-deep` / `text-brand-foreground` (dark umber bands) and ramps `wheat-*`, `umber-*`, `seal-*`, `marian-*`. Wax seal (`seal-*`) is the sparing accent — never use the skill's `accent` name for it (shadcn's `accent` is the hover fill).
- **Radius:** shadcn's scale (`--radius: 0.625rem`), not the skill's Tailwind-default radii.
- **Type:** body 14px (`text-sm`, shadcn's default). Fonts via `next/font`: `font-sans` Figtree, `font-heading` Zilla Slab (h1–h4 by default), `font-display` Geist (hero/wordmark only). Brand sizes: `text-display-1/2`, `text-h1/h2/h3`, `text-lead`, `text-overline`. Containers: `max-w-site` (1120), `max-w-prose` (720).
- **Links:** no blue, no underlines. Inherit text color; hover shifts to `seal-700`.
- **Components:** use shadcn components (recolored via tokens); only build custom ones (Lockup, NavBar, UnitCard, NewsCard…) where shadcn has none. Icons: `lucide-react`.
- **Dark mode:** planned but not designed yet — the `.dark` variant exists, no dark tokens defined.
- **Site Settings global** (`src/globals/SiteSettings.ts`, tabs Brand / Profile / Contact) holds name, wordmark, logo(s), favicon, profile and contacts. Read it on the frontend with `getSiteSettings()` from `src/lib/site-settings.ts` (cached, tag-revalidated on save); never hardcode brand or contact data.
- **Logo:** `public/brand/logo.png` (512px web copy of the skill's `assets/logo.png`). Payload admin uses it via `src/components/admin/{Logo,Icon}.tsx`; admin styling otherwise stays Payload default.
- Copy is formal Bahasa Indonesia; all content is placeholder until it comes from the CMS.

### Design skills precedence

Applies whenever `frontend-design` is loaded, whether invoked or auto-triggered.

- `gembala-baik-design` + the overrides above are the brief. Tokens, fonts, overlines, card style, radius and shadows are decided; don't revisit them.
- `frontend-design` may guide composition, hierarchy, hero choice and critique only, expressed through existing blocks/components and shadcn tokens.
- **Copy:** structure only (heading/lead/CTA order, label length, empty states). Voice and wording stay with `gembala-baik-design`.
- **Spacing:** existing scale and containers (`max-w-site`, `max-w-prose`). **Motion:** subtle, respects `prefers-reduced-motion`, proposed first. New image treatments (overlays, masks): proposed first.
- **New layout pieces** (hero variant, block type, component variant): propose first, stating whether the change is component-scoped or a global rule. Once agreed, global rules get recorded in the overrides above.
- **CMS fields:** layout changes keep existing hero/block field shapes. Any field add/rename/remove is proposed first, then `pnpm generate:types` + typecheck.
- If it suggests changing a brand rule, propose it to me instead of applying it.

## Content model

- **Pages** (`src/collections/Pages.ts`): title, slug (`home` = `/`), `hero` (`src/heros/config.ts`: none / split / centeredFull / centered / compact / minimal) and `layout` blocks (`src/blocks/config.ts`). Drafts, autosave, Live Preview (`/next/preview`), SEO tab. Publishing with >1 Accent button is blocked (`src/hooks/limitAccentButtons.ts`).
- Every block starts with the shared `section` group (`src/fields/section.ts`: anchorId, background page/warm/brand/brandDeep, heading + optional action link). Links use `src/fields/link.ts` (page + optional anchor, or external URL; optional appearance primary/secondary/accent/link).
- Blocks: richText, tabs, mediaText, cardGrid, cta, unitList, newsList, pengurusList, contact (Form Builder form).
- Collections: News (+ News Categories), Units, Pengurus (both drag-orderable), Media (alt required, focal point, webp sizes thumbnail/card/large), Users (role admin/editor; first user becomes admin).
- Globals: Site Settings, Navigation (header items + button, footer columns). Both admin-only to edit.
- Access helpers in `src/access`. Editors: Pages, News, Units, Pengurus, Media. Admin: everything incl. users, globals, forms.
- Plugins (`src/plugins.ts`): SEO (pages, news), Form Builder (text/email/phone/textarea/select/checkbox/message). Email adapter not configured yet (SMTP later).

## Frontend

- Routes: `/` + `/[slug]` (`src/components/PageView.tsx`), `/berita` (filter `?kategori=`, `?halaman=`), `/berita/[slug]`, `/next/preview` + `/next/exit-preview` (draft mode, staff only).
- Data: `src/lib/queries.ts` — `unstable_cache` per collection tag (`pages`, `news`, `units`, `pengurus`, `navigation`, `site-settings`); collections revalidate their tag via `src/hooks/revalidate.ts` (published changes only, so autosave doesn't thrash). Draft mode bypasses the cache.
- Rendering: `src/heros/RenderHero.tsx`, `src/blocks/RenderBlocks.tsx`, section wrapper/heading in `src/components/Section.tsx`, links via `src/components/CMSLink.tsx`, rich text via `src/components/RichText.tsx` (`prose prose-brand`).
- Dark bands set `data-tone="dark"`; components adapt with `in-data-[tone=dark]:` (e.g. Button `outline` → on-dark style). Button extra variants: `accent`, `onbrand`, size `xl`.
- Header: sticky, inline nav ≥ `lg`, shadcn Sheet below. Footer from Navigation + Site Settings.

## Project skills (`.claude/skills/`)

| Skill | Use for | Source |
| --- | --- | --- |
| `gembala-baik-design` | YPGB brand: palette, type, voice, component/page references (see overrides above) | Project |
| `payload` | Collections, fields, hooks, access control, Local API, queries, adapters. Start with `SKILL.md`, then `reference/`. | Official, `payloadcms/skills` |
| `shadcn` | Adding, composing, theming and debugging shadcn/ui components | Official, `shadcn-ui/ui` |
| `vercel-react-best-practices` | React/Next.js performance, data fetching, bundle size | Vercel, `vercel-labs/agent-skills` |
| `vercel-composition-patterns` | Component API design, compound components | Vercel, `vercel-labs/agent-skills` |
| `web-design-guidelines` | UI/accessibility/UX review | Vercel, `vercel-labs/agent-skills` |
| `tailwind-4-docs` | Tailwind v4 utilities, config, v3→v4 gotchas | Community, `lombiq/tailwind-agent-skills` |

Installed versions are pinned in `skills-lock.json`; update with `npx skills update -p`.

Not installed but available if needed: `payloadcms/skills/cms-migration` (import content from another CMS into Payload).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
