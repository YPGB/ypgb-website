const dateFormat = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

export const formatDate = (iso?: string | null) => (iso ? dateFormat.format(new Date(iso)) : '')

const sizeFormat = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })

export const fileSize = (bytes?: null | number) => {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${sizeFormat.format(mb)} MB` : `${sizeFormat.format(Math.max(1, bytes / 1024))} KB`
}

/** The file's type as readers know it, e.g. "PDF". */
export const fileKind = (filename?: null | string) => filename?.split('.').pop()?.toUpperCase() ?? ''

export const personName =(p: { titlePrefix?: string | null; name: string; titleSuffix?: string | null }) =>
  [p.titlePrefix, p.name].filter(Boolean).join(' ') + (p.titleSuffix ? `, ${p.titleSuffix}` : '')
