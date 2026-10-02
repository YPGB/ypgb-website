# Building YPGB with Tailwind — tokens, flex, responsiveness

For a developer or Claude session building production UI from this system. Read `readme.md` first for brand rules; this file covers implementation.

## 1. Setup

**Tailwind v4 (preferred)**, in the app's main CSS:

```css
@import "tailwindcss";
@import "<ds>/styles.css";          /* tokens, base styles, .gb-* component classes */
@import "<ds>/tailwind/theme.css";  /* brand colors, fonts, type scale as utilities */
```

**Tailwind v3:** `presets: [require('<ds>/tailwind/tailwind.config.js')]`, then import `<ds>/styles.css` after `@tailwind base;`.

Fonts load from Google Fonts via `tokens/fonts.css` (Geist, Zilla Slab, Figtree). Icons are Lucide: use `lucide-react` in production (`strokeWidth={2}`, `size={20}` default).

## 2. Token → utility map

What is Tailwind default and what is brand:

| Concern | Source | Use |
|---|---|---|
| Radius | Tailwind default | `rounded-sm` 4 · `rounded-md` 6 · `rounded-lg` 8 · `rounded-xl` 12 · `rounded-2xl` 16 · `rounded-full` |
| Shadow | Tailwind default | `shadow-xs` · `shadow-sm` · `shadow-md` · `shadow-lg` · `shadow-xl` |
| Status colors | Tailwind default | `green` / `amber` / `red` / `sky` (see below) |
| Breakpoints | Tailwind default | `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 |
| Spacing | Tailwind default scale (4px unit) | brand steps: `4.5` 18 · `6.5` 26 · `9` 36 · `13` 52 · `18` 72 · `26` 104 |
| Brand colors | `tokens/colors.css` | `wheat-*`, `umber-*`, `seal-*`, `marian-*`, `parchment` |
| Semantic colors | `tokens/colors.css` | `bg-page` `bg-card` `bg-sunken` `bg-brand` `bg-brand-deep` `bg-brand-soft` `bg-primary` `text-on-primary` `bg-accent` `text-ink` `text-ink-muted` `text-link` `border-hairline` `border-strong` |
| Fonts | brand | `font-display` (Geist, hero/wordmark only) · `font-heading` (Zilla Slab) · `font-sans` (Figtree, default) |
| Type sizes | brand | `text-display-1` 56 · `text-display-2` 42 · `text-h1` 34 · `text-h2` 27 · `text-h3` 21 · `text-lead` 19 · `text-base` 17 · `text-small` 15 · `text-caption` 13 · `text-overline` 12 |
| Containers | brand | `max-w-site` 1120 · `max-w-prose` 720 |

CSS variables mirror Tailwind names 1:1 for radius, shadow and status ramps: `rounded-lg` is `var(--radius-lg)`, `shadow-md` is `var(--shadow-md)`, `bg-green-100` is `var(--green-100)`. Inline styles and utilities can be mixed without drift.

**Status recipe** (always this pairing):

| State | Surface | Text | Border | Icon / edge |
|---|---|---|---|---|
| Success | `bg-green-100` | `text-green-800` | `border-green-200` | `text-green-600` |
| Warning | `bg-amber-100` | `text-amber-800` | `border-amber-200` | `text-amber-600` |
| Danger | `bg-red-100` | `text-red-800` | `border-red-200` | `text-red-600` |
| Info | `bg-sky-100` | `text-sky-800` | `border-sky-200` | `text-sky-600` |

Status colors are for system feedback only (toasts, form errors, badges). Never use Tailwind `blue-*` for links; links are `text-link` (Marian blue). The CSS `--blue-*` ramp is the Marian brand ramp, not Tailwind blue.

**Component defaults:** buttons and inputs use `rounded-md`, cards `rounded-lg shadow-sm border border-quiet`, dialogs `rounded-2xl shadow-lg`, badges `rounded-sm`, tags/switches/pill tabs `rounded-full`. Card hover: `hover:shadow-md hover:-translate-y-0.5`.

## 3. Utilities, `.gb-*` classes, or components?

1. **React components** (`components/**`) own interaction states and ARIA. Use them when you're in React.
2. **`.gb-*` classes** (`components/components.css`) give the same look in non-React markup, e.g. `<button class="gb-btn gb-btn--primary gb-btn--md">`.
3. **Tailwind utilities** handle layout: flex/grid, spacing, responsive visibility, one-off page composition. Avoid restyling a component with utilities (for example, don't override a Button's color). Add a variant instead.

## 4. Flex & grid rules

- **One dimension → flex, two dimensions → grid.** A toolbar, nav, button row, icon+label or badge row is flex. Card collections, footers and form rows are grid.
- **Space siblings with `gap-*`**, never margins between siblings. Inner padding is fine.
- **Wrap anything that can overflow.** Button groups, badge/tag rows and SectionHeading with an action get `flex flex-wrap gap-3`.
- **Text inside flex children needs `min-w-0`** (plus `truncate` or `line-clamp-*` where appropriate). Otherwise long Indonesian titles push layouts wide.
- **Fixed-size items get `shrink-0`**: icons, the logo seal, avatars, icon buttons.
- **Align icon + text with `items-center`.** Align multi-line label + description with `items-start`, with the icon nudged `mt-0.5`.
- **Grid tracks use `minmax(0,1fr)`** (Tailwind `grid-cols-*` already does this). Arbitrary tracks look like `grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]`.
- **No fixed heights on anything holding text.** Use `min-h-*`. Fixed heights are only for controls (buttons 32/40/48, inputs 42) and media with `aspect-*`.
- **Headings get `text-balance`, paragraphs get `text-pretty`.** Paragraphs are capped at `max-w-[68ch]`.
- **One primary action per view.** When CTAs stack on mobile: `flex flex-col sm:flex-row gap-3` with `w-full sm:w-auto` on the buttons.

## 5. Responsiveness

Build mobile-first and check at 375, 768, 1024 and 1280. The design reference in `ui_kits/website/` is desktop-only (≥1120). The patterns below define how each part collapses.

**Page container:** `mx-auto w-full max-w-site px-6` (24px gutter at every size, never removed).

**Section rhythm:** `py-18 md:py-26` (72 → 104). Heading-to-content gap: `mt-6.5 md:mt-9`.

**Type scaling** (body stays 17px everywhere):

| Role | Mobile | ≥ md | ≥ lg |
|---|---|---|---|
| Hero headline (Geist 700, uppercase) | `text-h1` 34 | `text-display-2` 42 | `text-display-2` 42 (`text-display-1` 56 only for ≤ 4-word lines) |
| Section title (Zilla Slab) | `text-[24px]` | `text-h2` 27 | — |
| Card title | `text-h3` 21 | — | — |

**Pattern by pattern:**

| Pattern | Layout |
|---|---|
| Header | `h-18` (72) sticky or static, never transparent. Below `md`: seal 36px + lockup (drop the "Yayasan Pendidikan" kicker below `sm`), nav links hidden, `IconButton icon="menu"` opens a full-width panel under the header with links stacked `h-11` (44) and the SPP/Daftar button `w-full`. ≥ `md`: inline links. The current `NavBar` component renders desktop only, so the mobile menu still has to be built. |
| Hero | `grid gap-13 items-center md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]`. On mobile the image drops below the text at `aspect-[4/3]`. |
| Unit cards (4) | `grid gap-6 sm:grid-cols-2 lg:grid-cols-4` |
| News cards (3) | `grid gap-6 md:grid-cols-2 lg:grid-cols-3`. On `md` the 3rd card spans or wraps, which is fine. |
| SectionHeading + action | `flex flex-wrap items-end justify-between gap-4`. The action link drops under the title on mobile. |
| Visi / Misi / Sejarah tabs | Tab row `flex gap-3 overflow-x-auto` (no wrapping), panel below. |
| Kontak | `grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]`. Info list first on mobile, form second. |
| Form rows | `grid gap-4.5 sm:grid-cols-2`. Textareas and submit span full width. Submit is `w-full sm:w-auto`. |
| Footer | `grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]`. The brand block spans 2 on `sm`. |
| Dialog | Centered `max-w-[520px] rounded-2xl` from `sm` up. Below `sm` it becomes a bottom sheet: scrim `items-end`, dialog `w-full rounded-t-2xl rounded-b-none`, footer buttons stacked full width. |
| Toast | `fixed inset-x-4 bottom-4` on mobile. From `sm` up: `sm:inset-x-auto sm:right-6 sm:w-[420px]`. |
| Tooltip | Supplementary only. Touch devices never see it, so essential info cannot live in a tooltip. |

**Touch & input:**
- Hit targets are ≥ 44px on touch. Below `md`, use Button `size="lg"` (48) for primary CTAs and IconButton `lg`. Make mobile nav rows `h-11`.
- Inputs need ≥ 16px text on mobile or iOS zooms on focus. The default control text is 15px, so add `text-base sm:text-small` on inputs.
- Show hover-only affordances (card lift) on hover-capable devices only: `[@media(hover:hover)]:hover:-translate-y-0.5`.

**Media:** give images and placeholders an aspect ratio (`aspect-[4/3]` hero, `aspect-video` news), plus `object-cover w-full`, never fixed pixel heights.

**Motion:** respect `motion-reduce:` (tokens already collapse durations under `prefers-reduced-motion`).

## 6. Checklist before shipping a screen

- Section backgrounds: parchment (`bg-page`), its warm tint (`bg-sunken`), dark umber (`bg-brand` / `bg-brand-deep`) only. Wax seal appears as one deliberate moment per page (at most one `accent` button).
- The brand mark is always the `Lockup` component (`size` sm header / md footer / lg standalone), never hand-set.
- Wheat-gold primary buttons use `text-on-primary` (dark ink), never white.
- Links are Marian blue. Nothing decorative is blue.
- No horizontal scroll at 375px (except intentional tab rows).
- Copy stays in Bahasa Indonesia and follows `readme.md` → Content fundamentals.
