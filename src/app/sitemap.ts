import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'

import { albumPath, journalPath, newsPath, pagePath, prayerPath } from '@/lib/preview'
import { getPayloadClient, TAGS } from '@/lib/queries'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

type Doc = { slug?: string | null; breadcrumbs?: { url?: string | null }[] | null; updatedAt: string }

/** Every collection with public pages. A new one only needs a row here. */
const sources = [
  { collection: 'pages', path: (doc: Doc) => pagePath(doc) },
  { collection: 'news', path: (doc: Doc) => newsPath(doc.slug) },
  { collection: 'prayers', path: (doc: Doc) => prayerPath(doc.slug) },
  { collection: 'journals', path: (doc: Doc) => journalPath(doc.slug) },
  { collection: 'albums', path: (doc: Doc) => albumPath(doc.slug) },
] as const

const getEntries = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const lists = await Promise.all(
      sources.map(async ({ collection, path }) => {
        const { docs } = await payload.find({
          collection,
          where: { _status: { equals: 'published' } },
          select: { slug: true, updatedAt: true, ...(collection === 'pages' && { breadcrumbs: true }) },
          limit: 5000,
          pagination: false,
        })
        return (docs as Doc[]).filter((doc) => doc.slug).map((doc) => ({ path: path(doc), updatedAt: doc.updatedAt }))
      }),
    )
    return lists.flat()
  },
  ['sitemap'],
  { tags: Object.values(TAGS) },
)

// Read from the database on request, so building the app doesn't need one.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getEntries()
  return entries.map(({ path, updatedAt }) => ({ url: `${serverUrl}${path}`, lastModified: updatedAt }))
}
