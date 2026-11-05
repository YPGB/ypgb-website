import NextLink from 'next/link'

import { Container } from '@/components/Section'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="py-26">
      <Container className="flex flex-col items-center gap-4.5 text-center">
        <h1 className="text-h1">Halaman tidak ditemukan</h1>
        <p className="text-muted-foreground">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <Button size="xl" nativeButton={false} render={<NextLink href="/" />}>
          Kembali ke Beranda
        </Button>
      </Container>
    </section>
  )
}
