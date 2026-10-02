One-line: in-page switcher — `underline` for page-level sections (Visi / Misi / Sejarah), `pill` for compact filters.

```jsx
<Tabs items={[{id:'visi',label:'Visi'},{id:'misi',label:'Misi'}]} value={t} onChange={setT} />
<Tabs variant="pill" items={['Gedung','Lingkungan','Kegiatan']} value={c} onChange={setC} />
```
