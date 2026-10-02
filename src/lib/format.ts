const dateFormat = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

export const formatDate = (iso?: string | null) => (iso ? dateFormat.format(new Date(iso)) : '')

export const personName = (p: { titlePrefix?: string | null; name: string; titleSuffix?: string | null }) =>
  [p.titlePrefix, p.name].filter(Boolean).join(' ') + (p.titleSuffix ? `, ${p.titleSuffix}` : '')
