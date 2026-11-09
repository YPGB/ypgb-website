'use client'

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import { Button } from '@/components/ui/button'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const ZOOM_STEPS = [1, 1.25, 1.5, 2]

/** One page at a time, fit to the column's width, so phones only fetch what they show. */
export default function PdfViewer({
  url,
  page,
  onPageChange,
  fallback,
}: {
  url: string
  page: number
  onPageChange: (page: number) => void
  fallback: React.ReactNode
}) {
  const [numPages, setNumPages] = useState(0)
  const [zoom, setZoom] = useState(0)
  const [width, setWidth] = useState(0)
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!frame.current) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [])

  const current = numPages ? Math.min(page, numPages) : page

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Halaman sebelumnya"
            disabled={current <= 1}
            onClick={() => onPageChange(current - 1)}
          >
            <ChevronLeft aria-hidden />
          </Button>
          <span aria-live="polite" className="min-w-24 text-center tabular-nums">
            {numPages ? `Halaman ${current} dari ${numPages}` : 'Memuat…'}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Halaman berikutnya"
            disabled={!numPages || current >= numPages}
            onClick={() => onPageChange(current + 1)}
          >
            <ChevronRight aria-hidden />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Perkecil"
            disabled={zoom === 0}
            onClick={() => setZoom(zoom - 1)}
          >
            <ZoomOut aria-hidden />
          </Button>
          <span className="min-w-12 text-center tabular-nums">{ZOOM_STEPS[zoom] * 100}%</span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Perbesar"
            disabled={zoom === ZOOM_STEPS.length - 1}
            onClick={() => setZoom(zoom + 1)}
          >
            <ZoomIn aria-hidden />
          </Button>
        </div>
      </div>
      <div ref={frame} className="min-h-96 overflow-x-auto bg-muted">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="py-26 text-center text-muted-foreground">Memuat dokumen…</p>}
          error={<div className="py-26 text-center">{fallback}</div>}
        >
          {width > 0 && (
            <Page
              pageNumber={current}
              width={width * ZOOM_STEPS[zoom]}
              loading={<p className="py-26 text-center text-muted-foreground">Memuat halaman…</p>}
              className="mx-auto w-fit"
            />
          )}
        </Document>
      </div>
    </div>
  )
}
