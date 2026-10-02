One-line: the site header — 72px dark umber band, seal logo (on a white chip) + typeset wordmark left, links right.

```jsx
<NavBar logo="assets/logo.png" activeId="home" onNavigate={setView}
  items={[{id:'home',label:'Home'},{id:'berita',label:'Berita'},{id:'karir',label:'Karir'}]}
  actions={<Button variant="onbrand" size="sm" href="https://spp.ypgb.or.id">SPP</Button>} />
```

Notes
- The logo path is relative to whatever page mounts NavBar — pass the correct relative path to `assets/logo.png`.
- External links (SPP portal, unit school sites) carry `external: true`.
