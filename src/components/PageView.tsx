import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { containBlocks } from '@/blocks/contain'
import type { ArchiveParams } from '@/blocks/NewsArchive'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'
import { getSidebarData, PageSidebar } from '@/components/layout/PageSidebar'
import { Container } from '@/components/Section'
import { heroSitsUnderHeader } from '@/heros/overlay'
import { RenderHero } from '@/heros/RenderHero'
import { pagePath } from '@/lib/preview'
import { mediaUrl } from '@/lib/site-settings'
import { getPage } from '@/lib/queries'

export async function PageView({
  slug,
  requestedPath,
  searchParams,
}: {
  slug: string
  /** The URL that was visited; if it isn't the page's full path, redirect there. */
  requestedPath?: string
  searchParams?: Promise<ArchiveParams>
}) {
  const page = await getPage(slug)
  if (!page) notFound()
  const path = pagePath(page)
  if (requestedPath && requestedPath !== path) redirect(path)
  const sidebar = await getSidebarData(page)
  const ctx = { path, searchParams, pageId: page.id }
  return (
    <>
      {path !== '/' && <PageBreadcrumb ancestors={page.breadcrumbs?.slice(0, -1)} current={page.title} />}
      <RenderHero hero={page.hero} overlaid={path === '/' && heroSitsUnderHeader(page.hero)} />
      {sidebar ? (
        <Container className="grid gap-9 py-13 md:py-18 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-13">
          <PageSidebar data={sidebar} page={page} />
          <div data-contained className="flex min-w-0 flex-col gap-13 md:gap-18">
            <RenderBlocks blocks={containBlocks(page.layout)} ctx={ctx} />
          </div>
        </Container>
      ) : (
        <RenderBlocks blocks={page.layout} ctx={ctx} />
      )}
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
