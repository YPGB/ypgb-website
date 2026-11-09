'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { Journal } from '@/payload-types'

// PDF.js is large and browser-only, so it loads only on journal pages, after the page itself.
const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => <div className="min-h-96 rounded-xl bg-muted" />,
})

/** The table of contents is part of the page's HTML, so search engines can read it; the PDF viewer isn't. */
export function JournalReader({
  url,
  articles,
  fallback,
}: {
  url: string
  articles?: Journal['articles']
  fallback: React.ReactNode
}) {
  const [page, setPage] = useState(1)
  const viewer = useRef<HTMLDivElement>(null)

  const open = (start: number) => {
    setPage(start)
    viewer.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className={cn('grid gap-9', articles?.length && 'lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start')}>
      {articles?.length ? (
        <section aria-labelledby="daftar-isi" className="min-w-0">
          <h2 id="daftar-isi" className="text-h3">
            Daftar Isi
          </h2>
          <ol className="mt-3 divide-y divide-border">
            {articles.map((article) => (
              <li key={article.id ?? article.title}>
                <button
                  type="button"
                  onClick={() => open(article.page)}
                  className="group flex w-full items-baseline justify-between gap-3 py-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold transition-colors group-hover:text-seal-700">
                      {article.title}
                    </span>
                    {article.authors && <span className="mt-0.5 block text-muted-foreground">{article.authors}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">hlm. {article.page}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      <div ref={viewer} className="min-w-0 scroll-mt-24">
        <PdfViewer url={url} page={page} onPageChange={setPage} fallback={fallback} />
      </div>
    </div>
  )
}
