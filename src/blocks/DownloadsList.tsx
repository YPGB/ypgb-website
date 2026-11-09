import { FileRow } from '@/components/cards/FileRow'
import { getFileCategories, getFileList } from '@/lib/queries'

import { ArchivePager, type ArchiveParams, CategoryChips } from './ArchiveNav'

/** Files from the chosen categories, newest first, with category chips (two or more categories) and pagination. */
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
  const { kategori, halaman } = (await params) ?? {}
  const page = Math.max(1, Number(halaman) || 1)
  const categories = (await getFileCategories()).filter((c) => categoryIds.includes(c.id))
  const active = categories.find((c) => c.slug === kategori)
  const files = await getFileList({ limit: perPage, page, categoryIds: active ? [active.id] : categoryIds })

  return (
    <div className="flex flex-col gap-9">
      {categories.length > 1 && <CategoryChips basePath={basePath} categories={categories} active={active?.slug} />}

      {files.docs.length ? (
        <ul className="divide-y divide-border border-y border-border">
          {files.docs.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </ul>
      ) : (
        <p className="py-13 text-center text-muted-foreground">Belum ada dokumen.</p>
      )}

      <ArchivePager basePath={basePath} active={active?.slug} page={page} totalPages={files.totalPages} />
    </div>
  )
}
