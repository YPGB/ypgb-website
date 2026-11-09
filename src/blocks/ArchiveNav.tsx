import NextLink from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** The filter and page in the URL, shared by the news and download archives. */
export type ArchiveParams = { kategori?: string; halaman?: string }

export const archiveHref = (basePath: string, kategori?: null | string, halaman?: number) => {
  const q = new URLSearchParams()
  if (kategori) q.set('kategori', kategori)
  if (halaman && halaman > 1) q.set('halaman', String(halaman))
  const s = q.toString()
  return s ? `${basePath}?${s}` : basePath
}

export function CategoryChips({
  basePath,
  categories,
  active,
}: {
  basePath: string
  categories: { id: number; slug?: null | string; title: string }[]
  active?: null | string
}) {
  return (
    <nav aria-label="Kategori" className="flex gap-2 overflow-x-auto pb-1">
      {[{ id: 0, slug: null, title: 'Semua' }, ...categories].map((c) => {
        const current = (c.slug ?? null) === (active ?? null)
        return (
          <NextLink
            key={c.id}
            href={archiveHref(basePath, c.slug)}
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
  )
}

export function ArchivePager({
  basePath,
  active,
  page,
  totalPages,
}: {
  basePath: string
  active?: null | string
  page: number
  totalPages: number
}) {
  if (totalPages < 2) return null
  return (
    <nav aria-label="Halaman" className="flex flex-wrap items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          variant={n === page ? 'default' : 'outline'}
          size="icon-lg"
          nativeButton={false}
          aria-current={n === page ? 'page' : undefined}
          render={<NextLink href={archiveHref(basePath, active, n)} />}
        >
          {n}
        </Button>
      ))}
    </nav>
  )
}
