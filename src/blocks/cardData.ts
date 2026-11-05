import type { LinkData } from '@/components/CMSLink'
import { personName } from '@/lib/format'
import { newsPath, pagePath } from '@/lib/preview'
import { getNewsList, getPageChildren, getPengurus, getTestimonials, getUnits } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type CardGrid = Extract<NonNullable<Page['layout']>[number], { blockType: 'cardGrid' }>

export type CardData = {
  id: string | number
  title: string
  text?: string | null
  icon?: NonNullable<CardGrid['cards']>[number]['icon']
  image?: number | Media | null
  link?: LinkData | null
}

const MORE = 'Selengkapnya'

/** A relative URL renders as an internal link in CMSLink. */
const internal = (url: string): LinkData => ({ type: 'external', url, label: MORE })

const heroImage = (hero: Page['hero']) =>
  hero?.backgroundImage ?? (Array.isArray(hero?.media) ? hero.media[0] : null)

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
