function App() {
  const { NavBar, Button } = window.GembalaBaikDesignSystem_674cc5;
  const [view, setView] = React.useState('home');
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'berita', label: 'Berita' },
    { id: 'kontak', label: 'Kontak' },
    { id: 'spp', label: 'SPP', href: 'https://spp.ypgb.or.id', external: true },
  ];
  const Screen = view === 'berita' ? window.Berita : view === 'kontak' ? window.Kontak : window.Home;
  const Footer = window.Footer;
  return (
    <div style={{fontFamily:'var(--font-sans)',background:'var(--surface-page)',minHeight:'100vh'}}>
      <NavBar logo="../../assets/logo.png" activeId={view} items={items} onNavigate={setView}
        actions={<Button variant="onbrand" size="sm" onClick={()=>setView('kontak')}>Daftar</Button>} />
      <Screen onNavigate={setView} />
      <Footer />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
