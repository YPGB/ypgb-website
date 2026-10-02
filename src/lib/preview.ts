const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const pathFor = (collection: 'pages' | 'news', slug?: string | null): string => {
  if (collection === 'news') return `/berita/${slug ?? ''}`
  return !slug || slug === 'home' ? '/' : `/${slug}`
}

export const previewUrl = (collection: 'pages' | 'news', slug?: string | null): string =>
  `${serverUrl}/next/preview?${new URLSearchParams({ collection, path: pathFor(collection, slug) })}`
