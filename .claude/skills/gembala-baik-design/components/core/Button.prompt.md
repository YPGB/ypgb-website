One-line: the standard action control — use `primary` for the main action in a view, `accent` only for admissions/registration CTAs, `secondary` for everything beside it.

```jsx
<Button variant="accent" size="lg" iconRight="arrow-right" href="#daftar">Daftar Sekarang</Button>
<Button variant="secondary">Pelajari Lebih</Button>
```

Notes
- Heights are fixed: sm 32, md 40, lg 48. Never restyle padding inline.
- `variant="link"` drops the box entirely (inline in prose).
- On a dark umber band, `primary` (wheat gold) and `accent` both hold contrast; use `onbrand` for the secondary action beside them.
- Wax seal is one deliberate moment per page: at most one `accent` button per view.
