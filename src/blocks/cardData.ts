import type { LinkData } from '@/components/CMSLink'
import type { MediaLike } from '@/components/Media'
import { formatDate, personName } from '@/lib/format'
import { albumPath, journalPath, newsPath, pagePath } from '@/lib/preview'
import {
  getAlbumList,
  getArchiveYears,
  getCollectionPage,
  getJournalList,
  getNewsList,
  getPageChildren,
  getPengurus,
  getTestimonials,
  getUnits,
} from '@/lib/queries'
import type { Album, Journal, Page } from '@/payload-types'

import { andWhere, type ArchiveState, searchWhere, yearWhere } from './ArchiveNav'

type CardGrid = Extract<NonNullable<Page['layout']>[number], { blockType: 'cardGrid' }>

export type CardData = {
  id: string | number
  title: string
  text?: string | null
  icon?: NonNullable<CardGrid['cards']>[number]['icon']
  image?: number | MediaLike | null
  link?: LinkData | null
}

const MORE = 'Selengkapnya'

/** A relative URL renders as an internal link in CMSLink. */
const internal = (url: string): LinkData => ({ type: 'external', url, label: MORE })

const heroImage = (hero: Page['hero']) =>
  hero?.backgroundImage ?? (Array.isArray(hero?.media) ? hero.media[0] : null)

type JournalLike = Pick<Journal, 'id' | 'title' | 'slug' | 'issue' | 'coverImage'>
type AlbumLike = Pick<Album, 'id' | 'title' | 'slug' | 'publishedAt' | 'cover' | 'photos'>

const journalCard = (j: JournalLike): CardData => ({
  id: j.id,
  title: j.title,
  text: j.issue,
  image: j.coverImage,
  link: internal(journalPath(j.slug)),
})

const albumCard = (a: AlbumLike): CardData => {
  const photo = a.cover ?? a.photos?.[0]
  return {
    id: a.id,
    title: a.title,
    text: formatDate(a.publishedAt),
    image: typeof photo === 'object' && photo ? { ...photo, alt: photo.alt || a.title } : null,
    link: internal(albumPath(a.slug)),
  }
}

const fromCollection = async (block: CardGrid, pageId?: number): Promise<CardData[]> => {
  switch (block.sourceCollection) {
    case 'news':
      return (await getNewsList({ limit: block.limit ?? 100 })).docs.map((n) => ({
        id: n.id,
        title: n.title,
        text: n.excerpt,
        image: n.coverImage,
        link: internal(newsPath(n.slug)),
      }))
    case 'units':
      return (await getUnits({})).map((u) => ({
        id: u.id,
        title: u.name,
        text: u.address,
        image: u.photo,
        link: u.website ? { type: 'external', url: u.website, label: MORE, newTab: true } : null,
      }))
    case 'pengurus':
      return (await getPengurus({})).map((p) => ({ id: p.id, title: personName(p), text: p.position, image: p.photo }))
    case 'testimonials':
      return (await getTestimonials({})).map((t) => ({ id: t.id, title: t.name, text: t.quote, image: t.photo }))
    case 'journals':
      return (await getJournalList()).map(journalCard)
    case 'albums':
      return (await getAlbumList()).map(albumCard)
    case 'subpages':
      if (!pageId) return []
      return (await getPageChildren(pageId)).map((p) => ({
        id: p.id,
        title: p.title,
        text: p.hero?.lead,
        image: heroImage(p.hero),
        link: internal(pagePath(p)),
      }))
    default:
      return []
  }
}

/** Manual cards or collection items, in one shape for both Card Grid styles. */
export const getCards = async (block: CardGrid, pageId?: number): Promise<CardData[]> => {
  if (block.source !== 'collection') {
    return (block.cards ?? []).map((c, i) => ({
      id: c.id ?? i,
      title: c.title,
      text: c.text,
      icon: c.icon,
      image: c.image,
      link: c.hasLink ? c.link : null,
    }))
  }
  const cards = await fromCollection(block, pageId)
  return block.limit ? cards.slice(0, block.limit) : cards
}

/** True when the grid shows its source as a filtered, paged archive (journals and albums only). */
export const isCardArchive = (block: CardGrid) =>
  block.source === 'collection' &&
  Boolean(block.showFilters) &&
  (block.sourceCollection === 'journals' || block.sourceCollection === 'albums')

/** One page of journal or album cards, filtered by search, year and (albums) unit, with the years and units to offer. */
export const getCardArchive = async (block: CardGrid, state: ArchiveState, page: number) => {
  const albums = block.sourceCollection === 'albums'
  const collection = albums ? 'albums' : 'journals'
  const filter = andWhere(
    searchWhere(state.cari, albums ? ['title'] : ['title', 'issue', 'abstract', 'articles.title', 'articles.authors']),
    yearWhere(state.tahun, 'publishedAt'),
    albums && state.unit ? { unit: { equals: state.unit } } : null,
  )
  const [result, years, units] = await Promise.all([
    getCollectionPage({ collection, limit: Number(block.perPage ?? 12), page, filter }),
    getArchiveYears({ collection, field: 'publishedAt', filter: { _status: { equals: 'published' } } }),
    albums ? getUnits({}) : Promise.resolve([]),
  ])
  const cards = albums
    ? (result.docs as Album[]).map(albumCard)
    : (result.docs as Journal[]).map(journalCard)
  return {
    cards,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    years,
    units: units.map((u) => ({ id: u.id, name: u.name })),
    noun: albums ? 'album' : 'jurnal',
    placeholder: albums ? 'Cari album…' : 'Cari judul, artikel atau penulis…',
  }
}
