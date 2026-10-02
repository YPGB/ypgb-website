One-line: the brand mark (seal + "Yayasan Pendidikan" + GEMBALA BAIK) — use it instead of hand-setting the wordmark anywhere.

```jsx
<Lockup logo="assets/logo.png" size="sm" chip />                       {/* header on dark umber */}
<Lockup logo="assets/logo.png" size="md" chip />                       {/* footer */}
<Lockup logo="assets/logo.png" size="lg" tone="onlight" place="Pontianak" /> {/* on parchment */}
```

Notes
- On dark grounds always set `chip` — the seal's line art is dark ink.
- On light grounds use `tone="onlight"` and no chip.
- Never retype the wordmark in other fonts or sentence case.
