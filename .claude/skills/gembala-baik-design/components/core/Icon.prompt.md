One-line: paints a Lucide glyph in the current text colour — the only icon primitive in this system; never inline a hand-drawn SVG.

```jsx
<Icon name="graduation-cap" size={20} />
<Icon name="map-pin" size={16} title="Lokasi" />
```

Notes
- Names are Lucide kebab-case. House glyphs: `graduation-cap`, `school`, `users`, `map-pin`, `phone`, `mail`, `calendar-days`, `newspaper`, `chevron-right`, `arrow-right`, `search`, `menu`, `x`, `external-link`, `heart-handshake`, `book-open-text`.
- Colour comes from `color` on the icon or its parent; size is set by `size`, not font-size.
- Requires network access to unpkg. Stroke weight is fixed at Lucide's default 2.
