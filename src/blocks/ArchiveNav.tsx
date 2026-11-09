import NextLink from 'next/link'
import type { Where } from 'payload'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** The filters and page in the URL, shared by every archive (news, downloads, journals, albums). */
export type ArchiveParams = { kategori?: string; halaman?: string; cari?: string; tahun?: string; unit?: string }

/** The filters, parsed. Every link inside an archive keeps them, except the page number. */
export type ArchiveState = { kategori?: null | string; cari?: null | string; tahun?: null | number; unit?: null | number }

const SEARCH_MAX = 80

export const readArchive = async (params?: Promise<ArchiveParams>) => {
  const p = (await params) ?? {}
  const tahun = /^\d{4}$/.test(p.tahun ?? '') ? Number(p.tahun) : null
  const unit = /^\d+$/.test(p.unit ?? '') ? Number(p.unit) : null
  const cari = p.cari?.trim().slice(0, SEARCH_MAX) || null
  return {
    state: { kategori: p.kategori || null, cari, tahun, unit } satisfies ArchiveState,
    page: Math.max(1, Number(p.halaman) || 1),
  }
}

export const archiveHref = (basePath: string, state: ArchiveState = {}, halaman?: number) => {
  const q = new URLSearchParams()
  if (state.kategori) q.set('kategori', state.kategori)
  if (state.cari) q.set('cari', state.cari)
  if (state.tahun) q.set('tahun', String(state.tahun))
  if (state.unit) q.set('unit', String(state.unit))
  if (halaman && halaman > 1) q.set('halaman', String(halaman))
  const s = q.toString()
  return s ? `${basePath}?${s}` : basePath
}

/** Words must all appear in one of the fields (Payload's `like`, case-insensitive). */
export const searchWhere = (cari: null | string | undefined, fields: string[]): Where | null =>
  cari ? { or: fields.map((field) => ({ [field]: { like: cari } })) } : null

/** Dates show in Jakarta time (UTC+7), so a year runs from 1 January 00:00 there. */
export const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000
const yearStart = (year: number) => new Date(Date.UTC(year, 0, 1) - JAKARTA_OFFSET_MS).toISOString()

export const yearWhere = (tahun: null | number | undefined, field: string): Where | null =>
  tahun
    ? {
        and: [{ [field]: { greater_than_equal: yearStart(tahun) } }, { [field]: { less_than: yearStart(tahun + 1) } }],
      }
    : null

/** Undefined when no part is set, so callers can pass it straight on as an optional filter. */
export const andWhere = (...parts: (Where | null | undefined)[]): Where | undefined => {
  const present = parts.filter((p): p is Where => Boolean(p))
  if (!present.length) return undefined
  return present.length === 1 ? present[0] : { and: present }
}

export function CategoryChips({
  basePath,
  categories,
  state,
}: {
  basePath: string
  categories: { id: number; slug?: null | string; title: string }[]
  state: ArchiveState
}) {
  return (
    <nav aria-label="Kategori" className="flex gap-2 overflow-x-auto pb-1">
      {[{ id: 0, slug: null, title: 'Semua' }, ...categories].map((c) => {
        const current = (c.slug ?? null) === (state.kategori ?? null)
        return (
          <NextLink
            key={c.id}
            href={archiveHref(basePath, { ...state, kategori: c.slug })}
            scroll={false}
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

/** "12 dokumen", plus "untuk “…”" while searching. */
export function ResultCount({ total, noun, state }: { total: number; noun: string; state: ArchiveState }) {
  if (!state.cari && !state.tahun && !state.unit) return null
  return (
    <p role="status" className="text-muted-foreground">
      {total} {noun}
      {state.cari && <> untuk “{state.cari}”</>}
      {state.tahun && <> pada {state.tahun}</>}
    </p>
  )
}

export function EmptyResult({ state, noun }: { state: ArchiveState; noun: string }) {
  const filtered = state.cari || state.tahun || state.unit
  return (
    <p className="py-13 text-center text-muted-foreground">
      {state.cari ? <>Tidak ada hasil untuk “{state.cari}”.</> : filtered ? `Tidak ada ${noun} yang cocok.` : `Belum ada ${noun}.`}
    </p>
  )
}

export function ArchivePager({
  basePath,
  state,
  page,
  totalPages,
}: {
  basePath: string
  state: ArchiveState
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
          render={<NextLink href={archiveHref(basePath, state, n)} />}
        >
          {n}
        </Button>
      ))}
    </nav>
  )
}
