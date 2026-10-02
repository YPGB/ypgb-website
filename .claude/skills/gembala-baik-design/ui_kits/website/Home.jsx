function Home({ onNavigate }) {
  const { SectionHeading, Button, Card, Tabs, Icon, UnitCard, NewsCard } = window.GembalaBaikDesignSystem_674cc5;
  const [tab, setTab] = React.useState('visi');
  const units = [
    { abbr: 'TK GB', level: 'TK', name: 'Taman Kanak-Kanak Gembala Baik', address: 'Jl. A. Yani, Pontianak', accreditation: 'Terakreditasi A' },
    { abbr: 'SD GB I', level: 'SD', name: 'Sekolah Dasar Gembala Baik I', address: 'Jl. Merdeka, Pontianak', accreditation: 'Terakreditasi A' },
    { abbr: 'SMP GB', level: 'SMP', name: 'Sekolah Menengah Pertama Gembala Baik', address: 'Jl. A. Yani, Pontianak', accreditation: 'Terakreditasi A' },
    { abbr: 'SMA GB', level: 'SMA', name: 'Sekolah Menengah Atas Gembala Baik', address: 'Jl. A. Yani, Pontianak', accreditation: 'Terakreditasi A' },
  ];
  const news = [
    { category: 'Kegiatan', date: '25 November 2025', title: 'Perayaan Hari Guru Nasional di Aula Yayasan', excerpt: 'Seluruh unit TK, SD, SMP dan SMA berkumpul untuk merayakan jasa para guru.', imageNote: 'Foto perayaan Hari Guru' },
    { category: 'Pengumuman', date: '2 Oktober 2025', title: 'Jadwal Pendaftaran Peserta Didik Baru 2026/2027', excerpt: 'Pendaftaran gelombang pertama dibuka mulai 10 Januari 2026.', imageNote: 'Foto pendaftaran siswa' },
    { category: 'Prestasi', date: '14 September 2025', title: 'Siswa SMA Gembala Baik Raih Juara Olimpiade Sains', excerpt: 'Tiga siswa mewakili Kalimantan Barat di tingkat nasional.', imageNote: 'Foto penyerahan medali' },
  ];
  const tabContent = {
    visi: 'Menjadi lembaga pendidikan Katolik yang unggul dalam iman, ilmu, dan pelayanan kasih di Kalimantan Barat.',
    misi: 'Menyelenggarakan pendidikan yang membentuk pribadi berkarakter, cerdas, dan berbelas kasih seperti Gembala yang Baik, dari jenjang TK hingga SMA.',
    sejarah: 'Yayasan Pendidikan Gembala Baik didirikan pada tahun 1973 oleh para Bruder MTB dan mitra awam di Pontianak, sebagai wujud karya pendidikan sosial Gereja Katolik.',
  };
  return (
    <div>
      <section style={{background:'var(--surface-brand)',color:'var(--text-inverse)',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-9) var(--container-pad)',display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:'var(--space-7)',alignItems:'center'}}>
          <div>
            <span style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:'var(--size-overline)',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold-300)'}}>Sejak 1973 · Pontianak</span>
            <h1 style={{fontFamily:'var(--font-display)',color:'var(--text-inverse)',fontSize:'var(--size-display-2)',fontWeight:'var(--weight-bold)',textTransform:'uppercase',lineHeight:'var(--lh-tight)',marginTop:'var(--space-3)',letterSpacing:'var(--ls-display)',textWrap:'balance'}}>Melayani dengan kasih, seperti Gembala yang Baik</h1>
            <p style={{color:'rgba(255,255,255,.82)',fontSize:'var(--size-lead)',lineHeight:'var(--lh-loose)',marginTop:'var(--space-4)',maxWidth:480}}>Empat jenjang pendidikan Katolik di Pontianak — dari Taman Kanak-Kanak hingga Sekolah Menengah Atas — dibangun atas iman, ilmu, dan pelayanan.</p>
            <div style={{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-6)'}}>
              <Button variant="accent" size="lg" iconRight="arrow-right" onClick={()=>onNavigate('kontak')}>Daftar Sekarang</Button>
              <Button variant="onbrand" size="lg" onClick={()=>onNavigate('berita')}>Lihat Berita</Button>
            </div>
          </div>
          <div style={{aspectRatio:'4/3',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.18)',borderRadius:'var(--radius-2xl)',display:'grid',placeItems:'center',color:'rgba(255,255,255,.55)',fontSize:'var(--size-small)',textAlign:'center',padding:'var(--space-5)'}}>Foto gedung utama Yayasan / suasana kampus</div>
        </div>
      </section>

      <section style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-gap) var(--container-pad)'}}>
        <SectionHeading overline="Tentang Kami" title="Visi, Misi &amp; Sejarah" align="left" />
        <div style={{marginTop:'var(--space-5)',display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
          <Tabs items={[{id:'visi',label:'Visi'},{id:'misi',label:'Misi'},{id:'sejarah',label:'Sejarah'}]} value={tab} onChange={setTab} style={{flexDirection:'row',borderBottom:'none',gap:'var(--space-3)',alignItems:'flex-start'}} />
          <Card tone="warm" rule pad="lg"><p style={{fontSize:'var(--size-lead)',lineHeight:'var(--lh-loose)',color:'var(--text-body)',margin:0}}>{tabContent[tab]}</p></Card>
        </div>
      </section>

      <section style={{background:'var(--surface-warm)'}}>
        <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-gap) var(--container-pad)'}}>
          <SectionHeading overline="Unit Sekolah" title="Empat jenjang, satu yayasan" subtitle="Dari Taman Kanak-Kanak hingga Sekolah Menengah Atas, seluruh unit berada dalam satu naungan Yayasan." />
          <div style={{marginTop:'var(--space-6)',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'var(--grid-gutter)'}}>
            {units.map(u => <UnitCard key={u.abbr} {...u} website="#" />)}
          </div>
        </div>
      </section>

      <section style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-gap) var(--container-pad)'}}>
        <SectionHeading overline="Berita" title="Kabar terbaru" action={<Button variant="link" iconRight="arrow-right" onClick={()=>onNavigate('berita')}>Lihat Semua</Button>} />
        <div style={{marginTop:'var(--space-6)',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'var(--grid-gutter)'}}>
          {news.map(n => <NewsCard key={n.title} {...n} />)}
        </div>
      </section>

      <section style={{background:'var(--surface-brand-deep)',color:'var(--text-inverse)'}}>
        <div style={{maxWidth:'var(--container-narrow)',margin:'0 auto',padding:'var(--space-8) var(--container-pad)',textAlign:'center'}}>
          <Icon name="heart-handshake" size={32} style={{color:'var(--gold-500)'}} />
          <h2 style={{fontFamily:'var(--font-heading)',color:'var(--text-inverse)',fontSize:'var(--size-h1)',marginTop:'var(--space-3)',textWrap:'balance'}}>Bergabunglah dengan keluarga Gembala Baik</h2>
          <p style={{color:'rgba(255,255,255,.78)',marginTop:'var(--space-3)',fontSize:'var(--size-lead)'}}>Pendaftaran peserta didik baru tahun ajaran 2026/2027 telah dibuka.</p>
          <div style={{marginTop:'var(--space-5)'}}><Button variant="primary" size="lg" onClick={()=>onNavigate('kontak')}>Hubungi Sekretariat</Button></div>
        </div>
      </section>
    </div>
  );
}
window.Home = Home;
