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
- **Section backgrounds:** parchment (`page`), `white`, `warm`, `brand`, `brandDeep`. White overrides the skill's "parchment, warm and dark bands only" rule.
- **Page margins:** always use `Container` (`src/components/Section.tsx`): gutters 16px, 32px from `md`, 80px from 1200px, and no maximum page width, so the margin stays the same when zooming out (as on Cleveland). Root font size stays fixed. Keep long text within the prose width, except the Rich Text block, which fills its available width.
- **Header:** parchment with umber text everywhere, matching the breadcrumb strip (overrides the skill's dark umber header), except transparent over the home hero only. The full-screen menu panel stays dark. No video in heroes; images only.
- **Photo overlays:** black (hero, hero slideshow and CTA band `bg-black/55`, Photo cards strip `bg-black/75`), not umber.
- **Radius:** shadcn's scale (`--radius: 0.625rem`), not the skill's Tailwind-default radii.
- **Type:** body 14px (`text-sm`, shadcn's default). Fonts via `next/font`: `font-sans` Figtree, `font-heading` Source Serif 4 (h1–h4 by default; replaces the skill's Zilla Slab), `font-editorial` Newsreader (statements only: article headline, Quote block and Big Quote), `font-display` Geist (hero/wordmark only). Brand sizes: `text-display-1/2`, `text-h1/h2/h3`, `text-lead`. Prose width: `max-w-(--container-prose)` (720). Tailwind's own `max-w-prose` is 65ch (about 583px at 14px), not 720.
- **Motion:** only Tailwind transitions/animation utilities and the animations shadcn components ship with (`tw-animate-css`). No animation libraries (Motion/Framer, GSAP, Lottie) and no animations tied to scroll position. A header that hides on scroll down and returns on scroll up is allowed (CSS transition). Keep the skill's timing (120–360ms, hover/focus/press, fade + small rise for overlays) and respect `prefers-reduced-motion` (`motion-safe:` / `motion-reduce:`).
- **No eyebrows:** headings never get an overline/eyebrow above them, in any layout (heroes, sections, pages). This overrides the skill's overline pattern.
- **Links:** no blue, no underlines. Inherit text color; hover shifts to `seal-700`.
- **Components:** use shadcn components (recolored via tokens); only build custom ones (Lockup, NavBar, UnitCard, NewsCard…) where shadcn has none. Icons: `lucide-react`; brand logos only via `react-bootstrap-icons` (MIT, `src/components/SocialIcon.tsx`).
- **Dark mode:** planned but not designed yet — the `.dark` variant exists, no dark tokens defined.
- **Site Settings global** (`src/globals/SiteSettings.ts`, tabs Brand / Profile / Contact) holds name, wordmark, logo(s), favicon, profile and contacts. Read it on the frontend with `getSiteSettings()` from `src/lib/site-settings.ts` (cached, tag-revalidated on save); never hardcode brand or contact data.
- **Logo:** `public/brand/logo.png` (512px web copy of the skill's `assets/logo.png`), a white-filled oval shown in its original shape with no circle or chip (`src/components/Lockup.tsx`). Payload admin uses it via `src/components/admin/{Logo,Icon}.tsx`; admin styling otherwise stays Payload default.
- Copy is formal Bahasa Indonesia; all content is placeholder until it comes from the CMS.

### Design skills precedence

Applies whenever `frontend-design` is loaded, whether invoked or auto-triggered.

- `gembala-baik-design` + the overrides above are the brief. Tokens, fonts, no eyebrows, card style, radius and shadows are decided; don't revisit them.
- `frontend-design` may guide composition, hierarchy, hero choice and critique only, expressed through existing blocks/components and shadcn tokens.
- **Copy:** structure only (heading/lead/CTA order, label length, empty states). Voice and wording stay with `gembala-baik-design`.
- **Spacing:** existing scale, `Container` and the prose width. **Motion:** subtle, respects `prefers-reduced-motion`, proposed first. New image treatments (overlays, masks): proposed first.
- **New layout pieces** (hero variant, block type, component variant): propose first, stating whether the change is component-scoped or a global rule. Once agreed, global rules get recorded in the overrides above.
- **CMS fields:** layout changes keep existing hero/block field shapes. Any field add/rename/remove is proposed first, then `pnpm generate:types` + typecheck.
- If it suggests changing a brand rule, propose it to me instead of applying it.

## Content model

- **Pages** (`src/collections/Pages.ts`): title, slug (`home` = `/`; unique across all pages), `parent` + hidden `breadcrumbs` (`@payloadcms/plugin-nested-docs`; full URL = `pagePath()` in `src/lib/preview.ts`, never build page URLs from the slug; `home` and `berita` stay top level; `src/hooks/validatePageParent.ts` refuses loops), drag-orderable, `showSidebar`, `hero` (`src/heros/config.ts`: none / split / centeredFull / centeredCarousel / centered / compact / minimal) and `layout` blocks (`src/blocks/config.ts`). Drafts, autosave, Live Preview (`/next/preview`), SEO tab. Publishing with >1 Accent button is blocked (`src/hooks/limitAccentButtons.ts`).
- Every block starts with the shared `section` group (`src/fields/section.ts`: anchorId, background page/white/warm/brand/brandDeep, heading + optional action link; `section({ alignOnly: true })` keeps only the alignment, for blocks with their own title like CTA). Links use `src/fields/link.ts` (published page + optional anchor, or external URL; optional appearance primary/secondary/accent/link).
- Blocks: richText (its editor also offers Big Quote, Image Carousel, Button and Inline CTA, `richTextEmbeds` in `src/blocks/config.ts`, rendered by `src/components/richtext/blockConverters.tsx`; also in News content, not in Tabs or Media + Text), tabs, contentGroup (section + rows of {optional label, any block except another group; nested blocks use contained mode, keep their heading and anchor, lose their background}), quote / list / gridList (`src/blocks/ContentBlocks.tsx`; standalone with section settings, or nested in a Content Group where `section({ nestable: true })` hides the section), mediaText, cardGrid (standard or photo cards; manual or from a collection: news, units, pengurus, testimonials, subpages, `src/blocks/cardData.ts`; photo card description opens on hover, always open without hover), cta (big/narrow, optional background photo on big), testimonials (collection, heading on the left, draggable carousel), unitList, newsList (latest / chosen / archive: category chips `?kategori=` + pagination `?halaman=`, `src/blocks/NewsArchive.tsx`; search params reach blocks as a promise so only archive pages render dynamically), pengurusList, contact (Form Builder form).
- Rich text editor (`src/payload.config.ts`): Payload defaults with a fixed toolbar, without H1.
- Collections: News (+ News Categories), Units, Pengurus, Testimonials (all three drag-orderable), Media (alt required, focal point, webp sizes thumbnail/card/large), Users (role admin/editor; first user becomes admin).
- Globals: Site Settings, Navigation (header items + submenus and "show in navbar", secondary links, link groups, button; footer band, footer link groups). Both admin-only to edit.
- Access helpers in `src/access`. Editors: Pages, News, Units, Pengurus, Testimonials, Media. Admin: everything incl. users, globals, forms.
- Plugins (`src/plugins.ts`): SEO (pages, news), Form Builder (text/email/phone/textarea/select/checkbox/message). Email adapter not configured yet (SMTP later).

## Frontend

- Routes: `/` + `/[...slug]` (`src/components/PageView.tsx`; looks up by last segment, redirects to the full path if the URL differs), `/berita` (renders the CMS page with slug `berita`; thin route because the `berita/` folder shadows `/[...slug]`), `/berita/[slug]` (News article template: no hero; centered block with a full-width title, category, date and author above a line, then the 720px body and a sticky "Berita Lainnya" column from `xl`, below the body otherwise; `src/components/cards/RelatedNews.tsx` picks 3 other articles, varied per article but stable so pages stay cacheable), `/next/preview` + `/next/exit-preview` (draft mode, staff only).
- Data: `src/lib/queries.ts` — `unstable_cache` per collection tag (`pages`, `news`, `units`, `pengurus`, `navigation`, `site-settings`); collections revalidate their tag via `src/hooks/revalidate.ts` (published changes only, so autosave doesn't thrash). Draft mode bypasses the cache.
- Rendering: `src/heros/RenderHero.tsx`, `src/blocks/RenderBlocks.tsx`, section wrapper/heading in `src/components/Section.tsx`, links via `src/components/CMSLink.tsx`, rich text via `src/components/RichText.tsx` (`prose prose-brand`).
- Dark bands set `data-tone="dark"`; components adapt with `in-data-[tone=dark]:` (e.g. Button `outline` → on-dark style). Button extra variants: `accent`, `onbrand`, size `xl`.
- Sidebar (`src/components/layout/PageSidebar.tsx`, page checkbox `showSidebar`): subpages of the page, or its siblings if it has none; sticky on `lg`, dropdown below. Next to it and in Content Group rows, blocks render inside `data-contained` (`containBlocks()`, `src/blocks/contain.ts`) with no bands, photos or section padding.
- Block grids respond to their container (`@xl`, `@2xl`, `@4xl`, inside the `@container` in `Section`), not the viewport, so they fit both full-width and sidebar pages. Use these in blocks and cards, not `sm:`/`md:`/`lg:`.
- Breadcrumb strip (`src/components/layout/PageBreadcrumb.tsx`): automatic on every page except home, and on articles; scrolls away.
- Header (`src/components/layout/Header.tsx`, `HeaderShell.tsx`, `NavPanel.tsx`): logo, highlighted button and a hamburger at every width, plus items ticked "Show in navbar" inline from `lg` (max 5), opening a full-screen shadcn Sheet (main items with submenus, secondary links, link groups, social logos). Hides on scroll down, returns on scroll up (`data-header-hidden` on `<html>`). Transparent at the top of the home page only, when `heroSitsUnderHeader()` says the hero is dark enough.
- Footer (`src/components/layout/Footer.tsx`): optional band above it (Navigation `footerBlocks`, CTA block, on every page), contact column from Site Settings with social logos, link groups flowing into columns, copyright line.

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
