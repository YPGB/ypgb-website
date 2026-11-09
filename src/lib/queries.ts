import config from '@payload-config'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import { NAVIGATION_TAG } from '@/globals/Navigation'
import { pagePath } from '@/lib/preview'
import type { Album, Journal, Prayer } from '@/payload-types'

export const TAGS = {
  pages: 'pages',
  news: 'news',
  units: 'units',
  pengurus: 'pengurus',
  testimonials: 'testimonials',
  prayers: 'prayers',
  files: 'files',
  journals: 'journals',
  albums: 'albums',
} as const

export const getPayloadClient = () => getPayload({ config })

export const isDraft = cache(async () => (await draftMode()).isEnabled)

export const getNavigation = unstable_cache(
  async () => (await getPayloadClient()).findGlobal({ slug: 'navigation', depth: 1 }),
  [NAVIGATION_TAG],
  { tags: [NAVIGATION_TAG] },
)

const findPage = async (slug: string, draft: boolean) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft,
    overrideAccess: draft,
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

const findPageCached = unstable_cache((slug: string) => findPage(slug, false), ['page'], {
  tags: [TAGS.pages],
})

export const getPage = cache(async (slug: string) =>
  (await isDraft()) ? findPage(slug, true) : findPageCached(slug),
)

export const getPagePaths = unstable_cache(
  async () => {
    const { docs } = await (await getPayloadClient()).find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      select: { slug: true, breadcrumbs: true },
      limit: 1000,
      pagination: false,
    })
    return docs.filter((d) => d.slug).map((d) => pagePath(d))
  },
  ['page-paths'],
  { tags: [TAGS.pages] },
)

type NewsQuery = { limit?: number; page?: number; categoryIds?: number[]; ids?: number[]; filter?: Where }

export const getNewsList = unstable_cache(
  async ({ limit = 9, page = 1, categoryIds, ids, filter }: NewsQuery) => {
    const base: Where = { _status: { equals: 'published' } }
    if (ids?.length) base.id = { in: ids }
    else if (categoryIds?.length) base.category = { in: categoryIds }
    const where: Where = filter ? { and: [base, filter] } : base
    return (await getPayloadClient()).find({
      collection: 'news',
      where,
      sort: '-publishedAt',
      limit,
      page,
      depth: 1,
      select: { title: true, slug: true, publishedAt: true, category: true, coverImage: true, excerpt: true },
    })
  },
  ['news-list'],
  { tags: [TAGS.news] },
)

const findArticle = async (slug: string, draft: boolean) => {
  const { docs } = await (await getPayloadClient()).find({
    collection: 'news',
    where: { slug: { equals: slug } },
    draft,
    overrideAccess: draft,
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

const findArticleCached = unstable_cache((slug: string) => findArticle(slug, false), ['article'], {
  tags: [TAGS.news],
})

export const getArticle = cache(async (slug: string) =>
  (await isDraft()) ? findArticle(slug, true) : findArticleCached(slug),
)

export const getNewsCategories = unstable_cache(
  async () =>
    (
      await (await getPayloadClient()).find({
        collection: 'news-categories',
        sort: 'title',
        limit: 100,
        pagination: false,
      })
    ).docs,
  ['news-categories'],
  { tags: [TAGS.news] },
)

export const getUnits = unstable_cache(
  async ({ ids, levels }: { ids?: number[]; levels?: string[] }) => {
    const where: Where = {}
    if (ids?.length) where.id = { in: ids }
    else if (levels?.length) where.level = { in: levels }
    const { docs } = await (await getPayloadClient()).find({
      collection: 'units',
      where,
      sort: '_order',
      limit: 100,
      pagination: false,
      depth: 1,
    })
    return ids?.length ? ids.map((id) => docs.find((d) => d.id === id)).filter((d) => !!d) : docs
  },
  ['units'],
  { tags: [TAGS.units] },
)

export const getPengurus = unstable_cache(
  async ({ organs }: { organs?: string[] }) => {
    const where: Where = { active: { equals: true } }
    if (organs?.length) where.organ = { in: organs }
    return (
      await (await getPayloadClient()).find({
        collection: 'pengurus',
        where,
        sort: '_order',
        limit: 200,
        pagination: false,
        depth: 1,
      })
    ).docs
  },
  ['pengurus'],
  { tags: [TAGS.pengurus] },
)

const findPageChildren = async (parentId: number, draft: boolean) => {
  const { docs } = await (await getPayloadClient()).find({
    collection: 'pages',
    where: { parent: { equals: parentId } },
    draft,
    overrideAccess: draft,
    select: { title: true, slug: true, breadcrumbs: true, hero: true },
    sort: '_order',
    depth: 1,
    limit: 100,
    pagination: false,
  })
  return docs
}

const findPageChildrenCached = unstable_cache((parentId: number) => findPageChildren(parentId, false), ['page-children'], {
  tags: [TAGS.pages],
})

export const getPageChildren = cache(async (parentId: number) =>
  (await isDraft()) ? findPageChildren(parentId, true) : findPageChildrenCached(parentId),
)

/** One document by slug: cached and published-only, or the latest draft in draft mode. */
const bySlug = <T>(collection: 'prayers' | 'journals' | 'albums', tag: string) => {
  const find = async (slug: string, draft: boolean) => {
    const { docs } = await (await getPayloadClient()).find({
      collection,
      where: { slug: { equals: slug } },
      draft,
      overrideAccess: draft,
      limit: 1,
      depth: 2,
    })
    return (docs[0] ?? null) as T | null
  }
  const cached = unstable_cache((slug: string) => find(slug, false), [collection, 'by-slug'], { tags: [tag] })
  return cache(async (slug: string) => ((await isDraft()) ? find(slug, true) : cached(slug)))
}

export const getPrayer = bySlug<Prayer>('prayers', TAGS.prayers)
export const getJournal = bySlug<Journal>('journals', TAGS.journals)
export const getAlbum = bySlug<Album>('albums', TAGS.albums)

export const getPrayerList = unstable_cache(
  async () =>
    (
      await (await getPayloadClient()).find({
        collection: 'prayers',
        where: { _status: { equals: 'published' } },
        select: { name: true, slug: true },
        sort: '_order',
        limit: 1000,
        pagination: false,
      })
    ).docs,
  ['prayer-list'],
  { tags: [TAGS.prayers] },
)

export const getJournalList = unstable_cache(
  async () =>
    (
      await (await getPayloadClient()).find({
        collection: 'journals',
        where: { _status: { equals: 'published' } },
        select: { title: true, slug: true, issue: true, coverImage: true },
        sort: '-publishedAt',
        limit: 100,
        pagination: false,
        depth: 1,
      })
    ).docs,
  ['journal-list'],
  { tags: [TAGS.journals] },
)

export const getAlbumList = unstable_cache(
  async () =>
    (
      await (await getPayloadClient()).find({
        collection: 'albums',
        where: { _status: { equals: 'published' } },
        select: { title: true, slug: true, publishedAt: true, cover: true, photos: true },
        sort: '-publishedAt',
        limit: 100,
        pagination: false,
        depth: 1,
      })
    ).docs,
  ['album-list'],
  { tags: [TAGS.albums] },
)

export const getFileList = unstable_cache(
  async ({ limit, page, categoryIds, filter }: { limit: number; page: number; categoryIds: number[]; filter?: Where }) =>
    (await getPayloadClient()).find({
      collection: 'files',
      where: filter ? { and: [{ category: { in: categoryIds } }, filter] } : { category: { in: categoryIds } },
      sort: '-date',
      limit,
      page,
      depth: 1,
    }),
  ['file-list'],
  { tags: [TAGS.files] },
)

export const getFileCategories = unstable_cache(
  async () =>
    (
      await (await getPayloadClient()).find({
        collection: 'file-categories',
        sort: 'title',
        limit: 100,
        pagination: false,
      })
    ).docs,
  ['file-categories'],
  { tags: [TAGS.files] },
)

export const getTestimonials = unstable_cache(
  async ({ ids }: { ids?: number[] }) =>
    (
      await (await getPayloadClient()).find({
        collection: 'testimonials',
        where: ids?.length ? { id: { in: ids } } : {},
        sort: '_order',
        limit: 100,
        pagination: false,
        depth: 1,
      })
    ).docs,
  ['testimonials'],
  { tags: [TAGS.testimonials] },
)

/** One page of published journals or albums for a filtered Card Grid. */
export const getCollectionPage = unstable_cache(
  async ({
    collection,
    limit,
    page,
    filter,
  }: {
    collection: 'journals' | 'albums'
    limit: number
    page: number
    filter?: Where
  }) => {
    const published: Where = { _status: { equals: 'published' } }
    return (await getPayloadClient()).find({
      collection,
      where: filter ? { and: [published, filter] } : published,
      sort: '-publishedAt',
      limit,
      page,
      depth: 1,
    })
  },
  ['collection-page'],
  { tags: [TAGS.journals, TAGS.albums] },
)

/** The years that have items, newest first, for an archive's year dropdown. */
export const getArchiveYears = unstable_cache(
  async ({
    collection,
    field,
    filter,
  }: {
    collection: 'news' | 'files' | 'journals' | 'albums'
    field: 'publishedAt' | 'date'
    filter?: Where
  }) => {
    const { docs } = await (await getPayloadClient()).find({
      collection,
      where: filter ?? {},
      select: { [field]: true },
      limit: 5000,
      pagination: false,
      depth: 0,
    })
    const years = new Set<number>()
    for (const doc of docs as unknown as Record<string, unknown>[]) {
      const value = doc[field]
      if (typeof value === 'string') years.add(new Date(new Date(value).getTime() + 7 * 60 * 60 * 1000).getUTCFullYear()) // Jakarta year
    }
    return [...years].sort((a, b) => b - a)
  },
  ['archive-years'],
  { tags: [TAGS.news, TAGS.files, TAGS.journals, TAGS.albums] },
)
