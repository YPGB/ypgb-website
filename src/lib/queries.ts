import config from '@payload-config'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import { NAVIGATION_TAG } from '@/globals/Navigation'
import { pagePath } from '@/lib/preview'

export const TAGS = {
  pages: 'pages',
  news: 'news',
  units: 'units',
  pengurus: 'pengurus',
  testimonials: 'testimonials',
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

type NewsQuery = { limit?: number; page?: number; categoryIds?: number[]; ids?: number[] }

export const getNewsList = unstable_cache(
  async ({ limit = 9, page = 1, categoryIds, ids }: NewsQuery) => {
    const where: Where = { _status: { equals: 'published' } }
    if (ids?.length) where.id = { in: ids }
    else if (categoryIds?.length) where.category = { in: categoryIds }
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
