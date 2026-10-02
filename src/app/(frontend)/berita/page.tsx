import type { Metadata } from 'next'
import NextLink from 'next/link'

import { NewsCard } from '@/components/cards/NewsCard'
import { Container } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { RenderHero } from '@/heros/RenderHero'
import { getNewsCategories, getNewsList } from '@/lib/queries'
import { cn } from '@/lib/utils'
import type { Page } from '@/payload-types'

export const metadata: Metadata = { title: 'Berita' }

const PER_PAGE = 9

type Props = { searchParams: Promise<{ kategori?: string; halaman?: string }> }

const href = (kategori?: string, halaman?: number) => {
  const q = new URLSearchParams()
  if (kategori) q.set('kategori', kategori)
  if (halaman && halaman > 1) q.set('halaman', String(halaman))
  const s = q.toString()
  return s ? `/berita?${s}` : '/berita'
}

export default async function NewsIndex({ searchParams }: Props) {
  const { kategori, halaman } = await searchParams
  const page = Math.max(1, Number(halaman) || 1)
  const categories = await getNewsCategories()
  const active = categories.find((c) => c.slug === kategori)
  const news = await getNewsList({ limit: PER_PAGE, page, categoryIds: active ? [active.id] : undefined })

  const hero = {
    type: 'compact',
    background: 'brand',
    title: 'Berita',
    lead: 'Kabar, pengumuman, dan kegiatan dari seluruh unit Yayasan.',
    showBreadcrumb: true,
  } as Page['hero']

  return (
    <>
      <RenderHero hero={hero} />
      <section className="py-13 md:py-18">
        <Container className="flex flex-col gap-9">
          {categories.length > 0 && (
            <nav aria-label="Kategori" className="flex gap-2 overflow-x-auto pb-1">
              {[{ slug: undefined, title: 'Semua', id: 0 }, ...categories].map((c) => {
                const current = (c.slug ?? undefined) === (active?.slug ?? undefined)
                return (
                  <NextLink
                    key={c.id}
                    href={href(c.slug ?? undefined)}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex h-9 shrink-0 items-center rounded-full border px-4.5 transition-colors',
                      current
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card hover:bg-muted',
                    )}
                  >
                    {c.title}
                  </NextLink>
                )
              })}
            </nav>
          )}

          {news.docs.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.docs.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          ) : (
            <p className="py-13 text-center text-muted-foreground">Belum ada berita.</p>
          )}

          {news.totalPages > 1 && (
            <nav aria-label="Halaman" className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: news.totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={n === page ? 'default' : 'outline'}
                  size="icon-lg"
                  nativeButton={false}
                  aria-current={n === page ? 'page' : undefined}
                  render={<NextLink href={href(active?.slug ?? undefined, n)} />}
                >
                  {n}
                </Button>
              ))}
            </nav>
          )}
        </Container>
      </section>
    </>
  )
}
