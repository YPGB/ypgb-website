const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

type PageRef = { slug?: string | null; breadcrumbs?: { url?: string | null }[] | null }

/** Full URL path of a page. Nested pages get it from their breadcrumbs, generated from the parent chain. */
export const pagePath = (page?: PageRef | null): string => {
  if (!page?.slug || page.slug === 'home') return '/'
  return page.breadcrumbs?.at(-1)?.url || `/${page.slug}`
}

export const newsPath = (slug?: string | null): string => `/berita/${slug ?? ''}`

export const previewUrl = (path: string): string =>
  `${serverUrl}/next/preview?${new URLSearchParams({ path })}`
