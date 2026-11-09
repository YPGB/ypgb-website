import { NewsCard } from '@/components/cards/NewsCard'
import { getNewsCategories, getNewsList } from '@/lib/queries'
import { cn } from '@/lib/utils'

import { ArchivePager, type ArchiveParams, CategoryChips } from './ArchiveNav'

export type { ArchiveParams } from './ArchiveNav'

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

  return (
    <div className="flex flex-col gap-9">
      {categories.length > 0 && <CategoryChips basePath={basePath} categories={categories} active={active?.slug} />}

      {news.docs.length ? (
        <div className={cn('grid gap-6', list ? 'mx-auto w-full max-w-4xl' : '@2xl:grid-cols-2 @4xl:grid-cols-3')}>
          {news.docs.map((n) => (
            <NewsCard key={n.id} item={n} layout={list ? 'list' : 'grid'} />
          ))}
        </div>
      ) : (
        <p className="py-13 text-center text-muted-foreground">Belum ada berita.</p>
      )}

      <ArchivePager basePath={basePath} active={active?.slug} page={page} totalPages={news.totalPages} />
    </div>
  )
}
