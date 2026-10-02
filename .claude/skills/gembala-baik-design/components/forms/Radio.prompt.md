One-line: single-choice control; always inside a `RadioGroup` so the label and spacing are right.

```jsx
<RadioGroup label="Kelas">
  <Radio name="kelas" label="Reguler" checked={k==='r'} onChange={...} />
  <Radio name="kelas" label="Kelas Plus" description="Kurikulum diperluas" checked={k==='p'} onChange={...} />
</RadioGroup>
```
