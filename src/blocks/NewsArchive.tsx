import NextLink from 'next/link'

import { NewsCard } from '@/components/cards/NewsCard'
import { Button } from '@/components/ui/button'
import { getNewsCategories, getNewsList } from '@/lib/queries'
import { cn } from '@/lib/utils'

export type ArchiveParams = { kategori?: string; halaman?: string }

/** All news with category chips and pagination; links stay on the current page (`basePath`). */
export async function NewsArchive({
  basePath,
  params,
  perPage,
  categoryIds,
  list,
}: {
  basePath: string
  params?: Promise<ArchiveParams>
  perPage: number
  categoryIds: number[]
  list: boolean
}) {
  const { kategori, halaman } = (await params) ?? {}
  const page = Math.max(1, Number(halaman) || 1)
  const all = await getNewsCategories()
  const categories = categoryIds.length ? all.filter((c) => categoryIds.includes(c.id)) : all
  const active = categories.find((c) => c.slug === kategori)
  const news = await getNewsList({
    limit: perPage,
    page,
    categoryIds: active ? [active.id] : categoryIds.length ? categoryIds : undefined,
  })

  const href = (kategori?: string | null, halaman?: number) => {
    const q = new URLSearchParams()
    if (kategori) q.set('kategori', kategori)
    if (halaman && halaman > 1) q.set('halaman', String(halaman))
    const s = q.toString()
    return s ? `${basePath}?${s}` : basePath
  }

  return (
    <div className="flex flex-col gap-9">
      {categories.length > 0 && (
        <nav aria-label="Kategori" className="flex gap-2 overflow-x-auto pb-1">
          {[{ id: 0, slug: null, title: 'Semua' }, ...categories].map((c) => {
            const current = (c.slug ?? null) === (active?.slug ?? null)
            return (
              <NextLink
                key={c.id}
                href={href(c.slug)}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'flex h-9 shrink-0 items-center rounded-full border px-4.5 transition-colors',
                  current ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted',
                )}
              >
                {c.title}
              </NextLink>
            )
          })}
        </nav>
      )}

      {news.docs.length ? (
        <div className={cn('grid gap-6', list ? 'mx-auto w-full max-w-4xl' : '@2xl:grid-cols-2 @4xl:grid-cols-3')}>
          {news.docs.map((n) => (
            <NewsCard key={n.id} item={n} layout={list ? 'list' : 'grid'} />
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
              render={<NextLink href={href(active?.slug, n)} />}
            >
              {n}
            </Button>
          ))}
        </nav>
      )}
    </div>
  )
}
