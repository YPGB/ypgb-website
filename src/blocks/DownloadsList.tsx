import { FileRow } from '@/components/cards/FileRow'
import { getArchiveYears, getFileCategories, getFileList } from '@/lib/queries'

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

/** Files from the chosen categories, newest first, with category chips (two or more categories), search, year and pagination. */
export async function DownloadsList({
  basePath,
  params,
  perPage,
  categoryIds,
}: {
  basePath: string
  params?: Promise<ArchiveParams>
  perPage: number
  categoryIds: number[]
}) {
  const { state, page } = await readArchive(params)
  const categories = (await getFileCategories()).filter((c) => categoryIds.includes(c.id))
  const active = categories.find((c) => c.slug === state.kategori)
  const scope = active ? [active.id] : categoryIds
  const filter = andWhere(searchWhere(state.cari, ['title', 'description']), yearWhere(state.tahun, 'date'))
  const [files, years] = await Promise.all([
    getFileList({ limit: perPage, page, categoryIds: scope, filter }),
    getArchiveYears({ collection: 'files', field: 'date', filter: { category: { in: scope } } }),
  ])
  const current = { ...state, kategori: active?.slug ?? null }

  return (
    <div className="flex flex-col gap-6.5">
      {categories.length > 1 && <CategoryChips basePath={basePath} categories={categories} state={current} />}
      <ArchiveFilters basePath={basePath} state={current} years={years} placeholder="Cari dokumen…" />
      <ResultCount total={files.totalDocs} noun="dokumen" state={current} />

      {files.docs.length ? (
        <ul className="divide-y divide-border border-y border-border">
          {files.docs.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </ul>
      ) : (
        <EmptyResult state={current} noun="dokumen" />
      )}

      <ArchivePager basePath={basePath} state={current} page={page} totalPages={files.totalPages} />
    </div>
  )
}
