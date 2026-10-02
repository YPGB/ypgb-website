/* YPGB × Tailwind v3 preset (legacy projects; prefer tailwind/theme.css on v4).
   Usage: presets: [require('<ds>/tailwind/tailwind.config.js')]
   and import <ds>/styles.css in your global CSS after `@tailwind base;`.
   v3 naming differs from v4 for radius/shadow: v3 `rounded` = v4 `rounded-sm` (4px),
   v3 `shadow` = v4 `shadow-sm`, v3 `shadow-sm` = v4 `shadow-xs`. Status colors,
   breakpoints and the rest of radius/shadow stay Tailwind defaults. */
const v = (n) => `var(--${n})`;
module.exports = {
  theme: {
    extend: {
      colors: {
        wheat: { DEFAULT: v('wheat-gold'), 50: v('gold-50'), 100: v('gold-100'), 300: v('gold-300'), 500: v('gold-500'), 600: v('gold-600'), 700: v('gold-700') },
        umber: { DEFAULT: v('shepherd-umber'), 50: v('sand-50'), 100: v('sand-100'), 200: v('sand-200'), 400: v('sand-400'), 600: v('sand-600'), 800: v('sand-800'), 900: v('sand-900'), 950: v('sand-950') },
        seal: { DEFAULT: v('wax-seal'), 50: v('clay-50'), 100: v('clay-100'), 400: v('clay-400'), 600: v('clay-600'), 700: v('clay-700'), 900: v('clay-900') },
        marian: { DEFAULT: v('marian-blue'), 50: v('blue-50'), 100: v('blue-100'), 300: v('blue-300'), 600: v('blue-600'), 700: v('blue-700'), 800: v('blue-800'), 900: v('blue-900') },
        parchment: v('parchment'),
        page: v('surface-page'), card: v('surface-card'), sunken: v('surface-sunken'),
        brand: { DEFAULT: v('surface-brand'), deep: v('surface-brand-deep'), soft: v('surface-brand-soft') },
        primary: { DEFAULT: v('surface-primary'), hover: v('surface-primary-hover') },
        'on-primary': v('text-on-primary'),
        accent: { DEFAULT: v('surface-accent'), soft: v('surface-accent-soft') },
        ink: { DEFAULT: v('text-body'), muted: v('text-muted'), subtle: v('text-subtle') },
        link: { DEFAULT: v('text-link'), hover: v('text-link-hover') },
        hairline: v('border-hairline'), quiet: v('border-quiet'), strong: v('border-strong'), focus: v('focus-ring'),
      },
      fontFamily: {
        display: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Zilla Slab"', 'Georgia', 'serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['56px', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-2': ['42px', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h1: ['34px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h2: ['27px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h3: ['21px', { lineHeight: '1.25' }],
        lead: ['19px', { lineHeight: '1.5' }],
        base: ['17px', { lineHeight: '1.5' }],
        small: ['15px', { lineHeight: '1.5' }],
        caption: ['13px', { lineHeight: '1.4' }],
        overline: ['12px', { letterSpacing: '0.14em' }],
      },
      /* Brand spacing steps missing from v3's default scale (v4 generates these automatically) */
      spacing: { 4.5: '18px', 6.5: '26px', 13: '52px', 18: '72px', 26: '104px' },
      maxWidth: { site: '1120px', prose: '720px' },
    },
  },
};
