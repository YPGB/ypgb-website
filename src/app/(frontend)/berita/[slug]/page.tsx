import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/Section'
import { Badge } from '@/components/ui/badge'
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
      <header data-tone="dark" className="bg-brand pt-13 pb-26 text-brand-foreground md:pt-18">
        <Container className="max-w-prose">
          <NextLink
            href="/berita"
            className="inline-flex items-center gap-1.5 text-sm opacity-75 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="size-4" aria-hidden /> Semua berita
          </NextLink>
          {category && (
            <Badge className="mt-6.5 block w-fit bg-seal-600 text-white">
              <NextLink href={`/berita?kategori=${category.slug}`}>{category.title}</NextLink>
            </Badge>
          )}
          <h1 className="mt-3 text-[28px] leading-tight md:text-h1">{article.title}</h1>
          <p className="mt-3 text-sm opacity-75">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.author}
          </p>
        </Container>
      </header>
      <Container className="-mt-18 max-w-[calc(var(--container-prose)+3rem)]">
        {typeof article.coverImage === 'object' && article.coverImage?.url && (
          <div className="relative mb-9 aspect-video overflow-hidden rounded-2xl bg-muted shadow-lg">
            <Media media={article.coverImage} sizes="(min-width: 768px) 720px, 100vw" priority />
          </div>
        )}
        <div className={article.coverImage ? '' : 'pt-26'}>
          <RichText data={article.content} className="text-base" />
        </div>
      </Container>
    </article>
  )
}
