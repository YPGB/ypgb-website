function Footer(){
  const { Lockup } = window.GembalaBaikDesignSystem_674cc5;
  const cols=[
    {h:'Unit Sekolah',items:['TK Gembala Baik','SD Gembala Baik I & II','SMP Gembala Baik','SMA Gembala Baik']},
    {h:'Yayasan',items:['Tentang Kami','Berita','Karir','Kontak']},
    {h:'Layanan',items:['Portal SPP','Pendaftaran Siswa Baru','Kalender Akademik']},
  ];
  return (
    <footer style={{background:'var(--surface-brand-deep)',color:'rgba(255,255,255,.82)'}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-8) var(--container-pad) var(--space-6)',display:'grid',gridTemplateColumns:'1.3fr 1fr 1fr 1fr',gap:'var(--space-6)'}}>
        <div>
          <Lockup logo="../../assets/logo.png" size="md" chip style={{color:'var(--text-inverse)'}} />
          <p style={{marginTop:'var(--space-4)',fontSize:'var(--size-small)',lineHeight:'var(--lh-loose)',maxWidth:280}}>Melayani pendidikan Katolik di Pontianak sejak 1973, dari jenjang TK hingga SMA.</p>
        </div>
        {cols.map(c=>(
          <div key={c.h}>
            <div style={{fontSize:'var(--size-caption)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',opacity:.6,marginBottom:'var(--space-3)'}}>{c.h}</div>
            <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)',fontSize:'var(--size-small)'}}>
              {c.items.map(i=><a key={i} href="#" style={{color:'rgba(255,255,255,.85)',textDecoration:'none'}}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,.12)',padding:'var(--space-4) var(--container-pad)',maxWidth:'var(--container-max)',margin:'0 auto',fontSize:'var(--size-caption)',opacity:.55,display:'flex',justifyContent:'space-between'}}>
        <span>© 2026 Yayasan Pendidikan Gembala Baik</span>
        <span>Jl. A. Yani, Pontianak, Kalimantan Barat</span>
      </div>
    </footer>
  );
}
window.Footer = Footer;
