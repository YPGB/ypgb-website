import { NewsCard } from '@/components/cards/NewsCard'
import { getArchiveYears, getNewsCategories, getNewsList } from '@/lib/queries'
import { cn } from '@/lib/utils'

import { ArchiveFilters } from './ArchiveFilters'
import {
  andWhere,
  ArchivePager,
  type ArchiveParams,
  CategoryChips,
  EmptyResult,
  readArchive,
  ResultCount,
  searchWhere,
  yearWhere,
} from './ArchiveNav'

export type { ArchiveParams } from './ArchiveNav'

/** All news with category chips, search, year and pagination; links stay on the current page (`basePath`). */
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
  const { state, page } = await readArchive(params)
  const all = await getNewsCategories()
  const categories = categoryIds.length ? all.filter((c) => categoryIds.includes(c.id)) : all
  const active = categories.find((c) => c.slug === state.kategori)
  const scope = active ? [active.id] : categoryIds.length ? categoryIds : undefined
  const filter = andWhere(searchWhere(state.cari, ['title', 'excerpt']), yearWhere(state.tahun, 'publishedAt'))
  const [news, years] = await Promise.all([
    getNewsList({ limit: perPage, page, categoryIds: scope, filter }),
    getArchiveYears({
      collection: 'news',
      field: 'publishedAt',
      filter: andWhere({ _status: { equals: 'published' } }, scope ? { category: { in: scope } } : null),
    }),
  ])
  const current = { ...state, kategori: active?.slug ?? null }

  return (
    <div className="flex flex-col gap-6.5">
      {categories.length > 0 && <CategoryChips basePath={basePath} categories={categories} state={current} />}
      <ArchiveFilters basePath={basePath} state={current} years={years} placeholder="Cari berita…" />
      <ResultCount total={news.totalDocs} noun="berita" state={current} />

      {news.docs.length ? (
        <div className={cn('grid gap-6', list ? 'mx-auto w-full max-w-4xl' : '@2xl:grid-cols-2 @4xl:grid-cols-3')}>
          {news.docs.map((n) => (
            <NewsCard key={n.id} item={n} layout={list ? 'list' : 'grid'} />
          ))}
        </div>
      ) : (
        <EmptyResult state={current} noun="berita" />
      )}

      <ArchivePager basePath={basePath} state={current} page={page} totalPages={news.totalPages} />
    </div>
  )
}
