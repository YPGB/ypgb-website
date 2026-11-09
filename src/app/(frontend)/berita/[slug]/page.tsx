import { CalendarDays, Tag, UserRound } from 'lucide-react'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'

import { RelatedNews } from '@/components/cards/RelatedNews'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/Section'
import { formatDate } from '@/lib/format'
import { getArticle, getNewsList } from '@/lib/queries'
import { mediaUrl } from '@/lib/site-settings'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const { docs } = await getNewsList({ limit: 100 })
    return docs.map((d) => ({ slug: d.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug)
  if (!article) return {}
  const image = mediaUrl(article.meta?.image) ?? mediaUrl(article.coverImage)
  return {
    title: article.meta?.title || article.title,
    description: article.meta?.description || article.excerpt || undefined,
    openGraph: { type: 'article', publishedTime: article.publishedAt, images: image ? [image] : undefined },
  }
}

export default async function Article({ params }: Props) {
  const article = await getArticle(decodeURIComponent((await params).slug))
  if (!article) notFound()
  const category = typeof article.category === 'object' ? article.category : null

  return (
    <article className="pb-18 md:pb-26">
      <PageBreadcrumb ancestors={[{ label: 'Berita', url: '/berita' }]} current={article.title} />
      <Container className="pt-13 md:pt-18">
        {/* Centered block: prose width alone, or prose + gap + side column from xl. */}
        <div className="mx-auto max-w-(--container-prose) xl:max-w-[68.25rem]">
          <header className="border-b border-border pb-6.5">
            <h1 className="font-editorial text-h1 md:text-display-2">{article.title}</h1>
            <div className="mt-6.5 flex flex-wrap items-center gap-x-4.5 gap-y-1.5 text-muted-foreground">
              {category && (
                <NextLink
                  href={`/berita?kategori=${category.slug}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-seal-700"
                >
                  <Tag className="size-4" aria-hidden />
                  {category.title}
                </NextLink>
              )}
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden />
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              {article.author && (
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="size-4" aria-hidden />
                  {article.author}
                </span>
              )}
            </div>
          </header>
          <div className="mt-9 xl:grid xl:grid-cols-[minmax(0,var(--container-prose))_20rem] xl:gap-13">
            <div className="min-w-0">
              {typeof article.coverImage === 'object' && article.coverImage?.url && (
                <div className="relative mb-9 aspect-video overflow-hidden rounded-xl bg-muted">
                  <Media media={article.coverImage} sizes="(min-width: 768px) 720px, 100vw" priority />
                </div>
              )}
              <RichText data={article.content} />
            </div>
            <RelatedNews articleId={article.id} />
          </div>
        </div>
      </Container>
    </article>
  )
}
