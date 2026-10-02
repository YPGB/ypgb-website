function Kontak() {
  const { SectionHeading, Card, Input, Select, Checkbox, Button, Icon, Toast } = window.GembalaBaikDesignSystem_674cc5;
  const [agree, setAgree] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  const info = [
    { icon: 'map-pin', label: 'Alamat', value: 'Jl. A. Yani, Pontianak, Kalimantan Barat' },
    { icon: 'phone', label: 'Telepon', value: '(0561) 700-000' },
    { icon: 'mail', label: 'Email', value: 'sekretariat@ypgb.or.id' },
    { icon: 'calendar-days', label: 'Jam Layanan', value: 'Senin–Jumat, 08.00–15.00 WIB' },
  ];
  return (
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-8) var(--container-pad) var(--space-9)'}}>
      <SectionHeading overline="Kontak" title="Hubungi Sekretariat Yayasan" subtitle="Pertanyaan seputar pendaftaran, administrasi, atau kerja sama dapat disampaikan melalui formulir berikut." />
      <div style={{marginTop:'var(--space-6)',display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:'var(--space-6)'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
          {info.map(i => (
            <Card key={i.label} pad="md" tone="warm" style={{display:'flex',gap:'var(--space-3)',alignItems:'flex-start'}}>
              <span style={{color:'var(--text-accent)',marginTop:2}}><Icon name={i.icon} size={18} /></span>
              <div>
                <div style={{fontSize:'var(--size-caption)',fontWeight:700,color:'var(--text-heading)',textTransform:'uppercase',letterSpacing:'.06em'}}>{i.label}</div>
                <div style={{fontSize:'var(--size-small)',color:'var(--text-subtle)',marginTop:2}}>{i.value}</div>
              </div>
            </Card>
          ))}
        </div>
        <Card pad="lg">
          {sent ? (
            <Toast tone="success" title="Pesan terkirim" onDismiss={()=>setSent(false)}>Sekretariat akan membalas melalui email pada hari kerja berikutnya.</Toast>
          ) : (
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)'}}>
                <Input label="Nama Lengkap" required placeholder="Nama sesuai identitas" />
                <Input label="Nomor Telepon" required placeholder="08xx-xxxx-xxxx" />
              </div>
              <Input label="Email" type="email" required placeholder="nama@email.com" />
              <Select label="Unit yang Dituju" required placeholder="Pilih unit" options={['TK Gembala Baik','SD Gembala Baik I','SD Gembala Baik II','SMP Gembala Baik','SMA Gembala Baik']} />
              <Input label="Pesan" multiline required placeholder="Tuliskan pertanyaan atau keperluan Anda" />
              <Checkbox label="Saya menyetujui data ini digunakan untuk keperluan korespondensi Yayasan" checked={agree} onChange={()=>setAgree(!agree)} />
              <Button type="submit" size="lg" disabled={!agree} iconRight="arrow-right">Kirim Pesan</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
window.Kontak = Kontak;
