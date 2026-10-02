import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { mediaUrl } from '@/lib/site-settings'
import { getPage } from '@/lib/queries'

export async function PageView({ slug }: { slug: string }) {
  const page = await getPage(slug)
  if (!page) notFound()
  return (
    <>
      <RenderHero hero={page.hero} />
      <RenderBlocks blocks={page.layout} />
    </>
  )
}

export async function pageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return {}
  const image = mediaUrl(page.meta?.image)
  return {
    title: slug === 'home' ? undefined : page.meta?.title || page.title,
    description: page.meta?.description || page.hero?.lead || undefined,
    openGraph: image ? { images: [image] } : undefined,
  }
}
