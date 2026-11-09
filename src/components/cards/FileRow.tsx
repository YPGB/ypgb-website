import { Download, File as FileIcon, FileArchive, FileSpreadsheet, FileText } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { toSrc } from '@/components/Media'
import { fileKind, fileSize, formatDate } from '@/lib/format'
import type { File as FileDoc } from '@/payload-types'

const icons: Record<string, typeof FileIcon> = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileSpreadsheet,
  ZIP: FileArchive,
}

/** Download link used by file lists and journals. */
export function DownloadButton({ file, label = 'Unduh' }: { file: FileDoc; label?: string }) {
  return (
    <Button
      variant="outline"
      nativeButton={false}
      render={<a href={toSrc(file.url ?? '')} download={file.filename ?? true} />}
    >
      <Download aria-hidden />
      {label}
    </Button>
  )
}

export function FileRow({ file }: { file: FileDoc }) {
  const kind = fileKind(file.filename)
  const Icon = icons[kind] ?? FileIcon
  const thumbnail = file.mimeType?.startsWith('image/') ? (file.sizes?.thumbnail?.url ?? file.url) : null
  const details = [formatDate(file.date), kind, fileSize(file.filesize)].filter(Boolean).join(' · ')

  return (
    <li className="flex flex-wrap items-center gap-x-4.5 gap-y-3 py-4.5">
      <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {thumbnail ? (
          <Image src={toSrc(thumbnail)} alt="" fill sizes="48px" unoptimized className="object-contain p-1" />
        ) : (
          <Icon className="size-5 text-muted-foreground" aria-hidden />
        )}
      </span>
      <div className="min-w-0 flex-[1_1_12rem]">
        <h3 className="text-h4">{file.title}</h3>
        {file.description && <p className="mt-1 whitespace-pre-line text-muted-foreground">{file.description}</p>}
        <p className="mt-1 text-xs text-muted-foreground">{details}</p>
      </div>
      <DownloadButton file={file} />
    </li>
  )
}
