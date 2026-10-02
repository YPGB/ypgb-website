function Berita() {
  const { SectionHeading, NewsCard, Tag } = window.GembalaBaikDesignSystem_674cc5;
  const all = [
    { category: 'Kegiatan', date: '25 November 2025', title: 'Perayaan Hari Guru Nasional di Aula Yayasan', excerpt: 'Seluruh unit TK, SD, SMP dan SMA berkumpul untuk merayakan jasa para guru dengan misa syukur dan pentas seni.', imageNote: 'Foto perayaan Hari Guru' },
    { category: 'Pengumuman', date: '2 Oktober 2025', title: 'Jadwal Pendaftaran Peserta Didik Baru 2026/2027', excerpt: 'Pendaftaran gelombang pertama dibuka mulai 10 Januari 2026 untuk seluruh jenjang.', imageNote: 'Foto pendaftaran siswa' },
    { category: 'Prestasi', date: '14 September 2025', title: 'Siswa SMA Gembala Baik Raih Juara Olimpiade Sains', excerpt: 'Tiga siswa mewakili Kalimantan Barat di tingkat nasional pada Olimpiade Sains Nasional.', imageNote: 'Foto penyerahan medali' },
    { category: 'Kegiatan', date: '30 Agustus 2025', title: 'Retret Guru dan Karyawan Yayasan di Singkawang', excerpt: 'Kegiatan tahunan untuk memperkuat semangat pelayanan seluruh tenaga pendidik.', imageNote: 'Foto retret guru' },
    { category: 'Pengumuman', date: '12 Agustus 2025', title: 'Pembukaan Kelas Plus SMA Gembala Baik', excerpt: 'Program kelas dengan kurikulum internasional tambahan mulai tahun ajaran depan.', imageNote: 'Foto kelas plus' },
    { category: 'Kegiatan', date: '17 Juli 2025', title: 'Masa Orientasi Peserta Didik Baru Berjalan Lancar', excerpt: 'Ratusan siswa baru dari empat jenjang mengikuti masa pengenalan lingkungan sekolah.', imageNote: 'Foto MOS' },
  ];
  const cats = ['Semua','Kegiatan','Pengumuman','Prestasi'];
  const [cat, setCat] = React.useState('Semua');
  const list = cat === 'Semua' ? all : all.filter(n => n.category === cat);
  return (
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-8) var(--container-pad) var(--space-9)'}}>
      <SectionHeading overline="Berita &amp; Pengumuman" title="Kabar Yayasan Gembala Baik" subtitle="Kegiatan, pengumuman, dan prestasi dari seluruh unit sekolah." />
      <div style={{display:'flex',gap:'var(--space-2)',marginTop:'var(--space-5)',flexWrap:'wrap'}}>
        {cats.map(c => <Tag key={c} selected={c===cat} onClick={()=>setCat(c)}>{c}</Tag>)}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',marginTop:'var(--space-6)'}}>
        {list.map(n => <NewsCard key={n.title} layout="row" {...n} />)}
      </div>
    </div>
  );
}
window.Berita = Berita;
