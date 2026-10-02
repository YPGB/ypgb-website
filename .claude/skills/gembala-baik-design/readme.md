# Gembala Baik Design System

Design system for **Yayasan Pendidikan Gembala Baik (YPGB)** — a Catholic education foundation in Pontianak, West Kalimantan, Indonesia, operating four school units from kindergarten through senior high school.

## Sources

No codebase, Figma file, or brand guideline document was attached for this project — only the company name and description ("Yayasan Pendidikan Gembala Baik"). Every token, component, and screen in this system was built from scratch, reasoning from that name, the foundation's likely institutional/Catholic-education context, and general Indonesian school-foundation conventions (unit structure TK/SD/SMP/SMA, SPP tuition portal, PPDB new-student admissions). **None of this is copied from a real YPGB asset** — if the user has a real logo, brand guide, existing website, or Figma file, replace the placeholders below with it; flagged explicitly throughout.

## Products represented

- **Public website** (`ui_kits/website/`) — the only surface built. Home, Berita (news), Kontak (contact/admissions inquiry). No mobile app or intranet was described, so none was built.

## Index

- `styles.css` — root stylesheet, imports everything below.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `shape.css`, `motion.css`, `fonts.css`, `base.css`.
- `components/core/` — Icon, Button, IconButton, Badge, Tag, Card, SectionHeading.
- `components/forms/` — Input, Select, Checkbox, Radio + RadioGroup, Switch.
- `components/navigation/` — NavBar, Tabs.
- `components/feedback/` — Dialog, Toast, Tooltip.
- `components/patterns/` — UnitCard (school-unit directory tile), NewsCard (news teaser).
- `guidelines/` — foundation specimen cards (colors, type, spacing, radius, shadow, brand mark, iconography) and `building-with-tailwind.md` (implementation guide: Tailwind setup, token→utility map, flex rules, responsive patterns).
- `tailwind/` — `theme.css` (Tailwind v4 `@theme`) and `tailwind.config.js` (v3 preset) exposing brand colors, fonts and type scale as utilities.
- `ui_kits/website/` — the public website recreation (`index.html` + `App/Home/Berita/Kontak/Footer.jsx`). Desktop-only reference; responsive behavior is specified in `guidelines/building-with-tailwind.md`.
- `assets/` — `logo.png`, the foundation seal.
- `SKILL.md` — Claude-Code-compatible skill wrapper for this system.

## Intentional additions

No component source existed to enumerate against, so the system authored a standard primitive set sized to a school-foundation site: Button, IconButton, Badge, Tag, Card, SectionHeading, Input, Select, Checkbox, Radio, Switch, NavBar, Tabs, Dialog, Toast, Tooltip, plus two content patterns specific to this brand — **UnitCard** (one school unit's directory entry) and **NewsCard** (a berita teaser). An **Icon** wrapper was added to standardize on one glyph set (see Iconography).

## Content fundamentals

Copy is written in **Bahasa Indonesia** throughout — this is a Pontianak institution serving Indonesian families; an English-language site would be tonally wrong.

- **Formality**: formal, institutional Indonesian. Third person or the neutral imperative, never the casual "kamu" — forms address the reader as "Anda" implicitly (never spelled out unless directly addressing a form-filler, e.g. "isi data Anda"). No slang, no contractions.
- **Register**: warm but composed — describes the foundation's mission ("melayani dengan kasih", "membentuk pribadi berkarakter") without hard-sell marketing language. Sentences are complete and unhurried; no punchy one-liners or hype adjectives.
- **Structure**: overline (small caps kicker) + slab-serif title + one lead sentence is the standard section-opening pattern. Body copy stays factual: dates, addresses, accreditation status, office hours — concrete details over vague claims.
- **Numbers & dates**: long-form Indonesian dates ("25 November 2025"), WIB timezone stated on hours, phone numbers in Indonesian grouping (0561) 700-000.
- **Emoji**: never used. This is an institutional, faith-affiliated context.
- **Example** (written for this system, not sourced): "Yayasan Pendidikan Gembala Baik didirikan pada tahun 1973 ... sebagai wujud karya pendidikan sosial Gereja Katolik." — historical, factual, unembellished.

## Visual foundations

**Colors.** A brand palette centered on brown and gold, not blue:

- *Wheat gold* (`--gold-500` `#fed980`) — the primary color: fills and buttons (`Button` primary, key badges). Paired with dark ink text, never white, since it's a light tone.
- *Shepherd umber* (`--sand-900` / `--ink-900` `#423326`) — the dark brand surface (nav, footer, closing CTA bands) and the ink used for all heading/body text. This is where "blue" used to sit — the header and footer are now a dark warm brown, not blue.
- *Muted umber* (`--sand-600` `#7a6b58`) — secondary/muted text.
- *Parchment* (`--sand-50` `#fbf4e4`) — the page background. Warm cream, never white or grey.
- *Wax seal* (`--clay-600`/`--clay-700` `#7a2e28`) — the sole accent, used sparingly for one deliberate moment per composition (an admissions CTA, an overline rule, a card's inner rule) — never a full surface.
- *Marian blue* (`--blue-700` `#2f5788`) — reserved for links only, never decorative. In dark mode it lightens to `--marian-blue-dark` `#5c85b8` for contrast against dark umber surfaces; every other color is fixed between modes.
- Semantic status colors use **Tailwind's default palette** (green / amber / red / sky: bg 100, text 800, border 200, solid 600) and appear only for real system feedback (toasts, form errors, status badges), never decoratively. The brand greens/crimson/goldenrod (*Ordinary time green*, *Alert crimson*, *Deep goldenrod*) remain as named editorial colors but are not used for UI status.
- Most ramp steps are blended from these anchor colors via CSS `color-mix(in oklch, …)` rather than hand-picked hex values, so every shade traces back to one of the named brand colors above.
- Max two background colors dominate any page: parchment (page) and dark umber (header/footer/closing bands). Wax seal never fills a full section.

**Type.** Three families now: **Geist** (display — hero headlines, the brand-mark wordmark; used sparingly, only at true display scale), **Zilla Slab** (headings — section titles, dialog titles, card headings) paired with **Figtree** (body — everything else, forms, nav labels). The slab gives the institutional/scholastic weight a school foundation calls for; Geist adds a crisper, more contemporary voice at the biggest moments without replacing Zilla Slab everywhere. *None of the three font files were supplied — all are Google Fonts substitutions.* See Typography note below.

**Spacing.** A 4px-based ramp that widens geometrically (4 → 8 → 12 → 18 → 26 → 36 → 52 → 72 → 104), not a flat 8px grid — large section gaps (`--space-9`, 104px) stay generous and breathing, small ones (`--space-1`–`--space-3`) stay tight for form fields and inline groups.

**Backgrounds.** Flat color fields only — no gradients, no photographic full-bleed backgrounds, no repeating patterns or textures, no hand-drawn illustration. The hero section uses a solid dark umber band with a placeholder image slot beside the text, not a full-bleed photo overlay. This keeps the system honest about having no real photography yet (see Assets) rather than faking texture.

**Animation.** Minimal and functional: 120–360ms transitions (`--dur-fast/base/slow`) on hover/focus/press only — color shifts, a 1px lift on card/button hover, dialog/toast entrances that fade + rise 10px. No bounce, no scale-in flourish, no continuous/ambient motion. `prefers-reduced-motion` collapses all durations to near-zero.

**Hover states.** Primary/accent buttons darken one step and lift 1px with a slightly heavier shadow. Secondary/ghost buttons and nav links gain a soft warm sand fill (`--surface-brand-soft`), never a border-only or opacity-only change. Cards with `interactive` lift 2px and deepen their shadow. Links darken on hover and their underline shifts to wax seal.

**Press states.** Buttons and icon buttons scale to 0.985 on `:active` — a subtle physical "give," no color change beyond what hover already applied.

**Borders & shadows.** Borders are hairline (1px) and warm-tinted (`--border-hairline` is a sand tone, not neutral grey). Shadows use **Tailwind's default shadow scale** unchanged (`--shadow-xs` … `--shadow-2xl`, identical to `shadow-*` utilities), tied to elevation: resting cards `sm`, hover/floating `md`, dialogs `lg`. No inner shadows except a 1px top highlight on solid buttons.

**Corner radii.** **Tailwind's default radius scale**, same names (`--radius-sm` 4 · `md` 6 · `lg` 8 · `xl` 12 · `2xl` 16 · `3xl` 24 · `full`). Badges `sm`, buttons and inputs `md`, cards `lg`, dialogs and hero media `2xl`, tags/switches/pill tabs `full`. Buttons are never pill-shaped, since that reads as more consumer-app than institutional.

**Cards.** White on the parchment page, `rounded-lg` (8px), hairline border, `shadow-sm` at rest, no colored left-border accent. A `rule` variant adds a thin wax-seal rule down the *inner* left edge for quote-like or devotional content (e.g. a mission statement), used sparingly.

**Transparency & blur.** Used only for two things: the dialog scrim (52% umber with a 2px blur) and translucent white overlays on the dark umber hero background (image placeholder box at 8% white). Never used for glassmorphism-style panels or blurred card backgrounds.

**Imagery color vibe.** No real photography exists in this system yet. Placeholders describe what's needed (e.g. "Foto gedung utama Yayasan," "Foto perayaan Hari Guru") — when real photos arrive, prefer warm, natural daylight tones consistent with the umber/wheat/parchment palette; avoid cool, desaturated, or heavily filtered treatments that would clash with the warm neutral ramp.

**Layout rules.** Content max-width 1120px, centered, with a 24px side gutter that never disappears. The header is a fixed-height 72px dark umber band; it does not go transparent or float over hero content. Sections alternate parchment (`--surface-page`), its warm tint (`--surface-warm`), and dark umber bands (`--surface-brand` / `-deep`); no other section backgrounds. The brand mark is always the `Lockup` component, never hand-set.

## Typography note — font substitution (please confirm)

No YPGB font files were supplied, so three Google Fonts were chosen to stand in:

- **Geist** (display) — reserved for hero-scale headlines and the brand-mark wordmark; a contemporary grotesque used sparingly, only at the biggest moments.
- **Zilla Slab** (headings) — a humanist slab suited to an institutional, education-sector identity; used for section titles, dialog titles, and card headings.
- **Figtree** (body/UI) — a warm, rounded-but-legible grotesque for long-form Indonesian body copy and form fields.

If the real YPGB brand uses different typefaces, please share the font files (or the names) and this will be swapped throughout `tokens/fonts.css` and `tokens/typography.css`.

## Iconography

No icon font, sprite sheet, or icon SVGs were supplied. The system standardizes on **Lucide** (stroke-width 2, round caps, MIT-licensed), loaded per-glyph from the `lucide-static` CDN and painted via CSS mask so every icon inherits `currentColor` — see `components/core/Icon.jsx`. This is a substitution, not a match confirmed against a real YPGB icon system; flagged for the same reason as the fonts. No emoji, no Unicode-character icons, and no hand-drawn SVGs are used anywhere in this system. House glyph vocabulary: `graduation-cap`, `school`, `users`, `map-pin`, `phone`, `mail`, `calendar-days`, `newspaper`, `heart-handshake`, `book-open-text`, `award`, `user-round`, plus UI chrome (`chevron-right`, `arrow-right`, `search`, `menu`, `x`, `external-link`, `check`, `circle-check`, `triangle-alert`, `octagon-alert`, `info`).

## Assets

`assets/logo.png` — the foundation's seal: the Good Shepherd with the lamb, ringed by "Yayasan Pendidikan Gembala Baik Pontianak" and the Latin motto "Sub Cura Pastoris Boni Crescimus." Dark umber line art on a transparent ground, drawn for light backgrounds. On the dark umber header/footer band it sits inside a small white circular chip (see `NavBar`'s `logo` prop and `Footer.jsx`) so the line art keeps contrast; on parchment or white it can sit directly, as in the brand-mark specimen card and the project thumbnail.

## Components

**Core**: Icon, Button, IconButton, Badge, Tag, Card, SectionHeading. **Forms**: Input, Select, Checkbox, Radio, RadioGroup, Switch. **Navigation**: NavBar, Tabs. **Feedback**: Dialog, Toast, Tooltip. **Patterns**: UnitCard, NewsCard.

## Caveats — please help iterate

1. **No other real source material was provided** — no brand font files, no existing site/codebase, no Figma. Only the real logo (added) and the company name informed this build; palette, type pairing, copy, and the website layout are still an original construction. Treat this as a strong starting proposal, not ground truth.
2. Fonts (Geist / Zilla Slab / Figtree) and icons (Lucide) are all substitutions — flagged above. Send real files if they exist.
3. Only one product (the public website) was built. If YPGB also has a mobile app, a parent portal, or a separate site per unit (TK/SD/SMP/SMA), say so and a UI kit can be added for each.
4. All photography is a labeled placeholder. Real photos of the campus, units, and events would make the biggest visual difference here.

**Please send**: brand font files (or confirm the Google Fonts substitution is fine) and any existing site/screenshots/Figma so the layout can be corrected to match reality rather than a best guess.
