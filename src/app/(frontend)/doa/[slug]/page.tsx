import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'
import { getPrayerSidebar, PageSidebar, sidebarGrid } from '@/components/layout/PageSidebar'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/Section'
import { RenderHero } from '@/heros/RenderHero'
import { PRAYER_ROOT, prayerPath } from '@/lib/preview'
import { getPage, getPrayer, getPrayerList } from '@/lib/queries'
import { mediaUrl } from '@/lib/site-settings'

type Props = { params: Promise<{ slug: string }> }

const DESCRIPTION_LENGTH = 155

export async function generateStaticParams() {
  try {
    return (await getPrayerList()).map((prayer) => ({ slug: prayer.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prayer = await getPrayer(decodeURIComponent((await params).slug))
  if (!prayer) return {}
  const text = convertLexicalToPlaintext({ data: prayer.prayer }).replace(/\s+/g, ' ').trim()
  const image = mediaUrl(prayer.meta?.image)
  return {
    title: prayer.meta?.title || prayer.name,
    description: prayer.meta?.description || text.slice(0, DESCRIPTION_LENGTH),
    openGraph: image ? { images: [image] } : undefined,
  }
}

/** Keeps the `doa` page's hero on every prayer, so moving between them only changes the text and the sidebar highlight. */
export default async function PrayerPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug)
  const [prayer, root] = await Promise.all([getPrayer(slug), getPage(PRAYER_ROOT)])
  if (!prayer) notFound()
  const sidebar = await getPrayerSidebar(root?.title)

  const body = (
    <article className="min-w-0">
      <h1 className="text-h2 md:text-h1">{prayer.name}</h1>
      <RichText data={prayer.prayer} className="mt-6.5 max-w-(--container-prose)" />
    </article>
  )

  return (
    <>
      <PageBreadcrumb ancestors={[{ label: root?.title ?? 'Doa', url: `/${PRAYER_ROOT}` }]} current={prayer.name} />
      <RenderHero hero={root?.hero} titleAs="p" />
      {sidebar ? (
        <Container className={sidebarGrid}>
          <PageSidebar data={sidebar} current={{ title: prayer.name, href: prayerPath(prayer.slug) }} />
          {body}
        </Container>
      ) : (
        <Container className="py-13 md:py-18">{body}</Container>
      )}
    </>
  )
}
