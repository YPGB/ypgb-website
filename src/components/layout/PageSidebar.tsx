import { ArrowLeft, ChevronDown } from 'lucide-react'
import NextLink from 'next/link'

import { pagePath, PRAYER_ROOT, prayerPath } from '@/lib/preview'
import { getPageChildren, getPrayerList } from '@/lib/queries'
import { cn } from '@/lib/utils'
import type { Page } from '@/payload-types'

import { SidebarFilter } from './SidebarFilter'

type SidebarLink = { title: string; href: string }

export type SidebarData = {
  root: SidebarLink
  items: (SidebarLink & { id: number | string })[]
  /** The section above this one. */
  back?: { label: string; href: string } | null
  /** Adds a search field that narrows the list as you type (prayers). */
  searchable?: boolean
}

/** The grid that puts `PageSidebar` next to a page's content. */
export const sidebarGrid =
  'grid gap-9 py-13 md:py-18 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-13'

const pageSection = async (root: Pick<Page, 'id' | 'title' | 'slug' | 'breadcrumbs'>): Promise<SidebarData> => {
  const parent = root.breadcrumbs?.at(-2)
  return {
    root: { title: root.title, href: pagePath(root) },
    back: parent?.url ? { label: parent.label ?? '', href: parent.url } : null,
    items: (await getPageChildren(root.id)).map((item) => ({ id: item.id, title: item.title, href: pagePath(item) })),
  }
}

/** Prayers read like subpages of the `doa` page, though they live in their own collection. */
export const getPrayerSidebar = async (rootTitle?: string | null): Promise<SidebarData | null> => {
  const prayers = await getPrayerList()
  if (!prayers.length) return null
  return {
    root: { title: rootTitle ?? 'Doa', href: `/${PRAYER_ROOT}` },
    items: prayers.map((prayer) => ({ id: prayer.id, title: prayer.name, href: prayerPath(prayer.slug) })),
    searchable: true,
  }
}

/** The section a page belongs to: itself if it has subpages, otherwise its parent. Null if it stands alone. */
export const getSidebarData = async (page: Page): Promise<SidebarData | null> => {
  if (page.slug === PRAYER_ROOT) return getPrayerSidebar(page.title)
  if (!page.showSidebar) return null
  const section = await pageSection(page)
  if (section.items.length) return section
  if (typeof page.parent !== 'object' || !page.parent) return null
  return pageSection(page.parent)
}

const itemClass = (active: boolean) =>
  cn(
    '-ml-px block border-l-2 py-1.5 pl-4 transition-colors hover:text-seal-700',
    active ? 'border-seal-600 font-semibold text-seal-700' : 'border-transparent text-muted-foreground',
  )

function SidebarLinks({ root, items, back, searchable, current }: SidebarData & { current: string }) {
  const link = (item: SidebarData['items'][number]) => (
    <NextLink
      href={item.href}
      aria-current={item.href === current ? 'page' : undefined}
      className={itemClass(item.href === current)}
    >
      {item.title}
    </NextLink>
  )
  return (
    <>
      {back && (
        <NextLink
          href={back.href}
          className="mb-4.5 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-seal-700"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Kembali ke {back.label}
        </NextLink>
      )}
      <NextLink href={root.href} className="block font-heading text-h3 transition-colors hover:text-seal-700">
        {root.title}
      </NextLink>
      {searchable ? (
        <SidebarFilter
          label={`Cari di ${root.title}`}
          placeholder={`Cari ${root.title.toLowerCase()}…`}
          items={items.map((item) => ({ key: item.id, title: item.title, node: link(item) }))}
        />
      ) : (
        <ul className="mt-3 border-l border-border">
          {items.map((item) => (
            <li key={item.id}>{link(item)}</li>
          ))}
        </ul>
      )}
    </>
  )
}

/** Sticky list on desktop, collapsed dropdown on smaller screens (`defaultOpen` starts it open). */
export function PageSidebar({
  data,
  current,
  defaultOpen,
}: {
  data: SidebarData
  current: SidebarLink
  defaultOpen?: boolean
}) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto lg:transition-[top] lg:duration-300 lg:motion-reduce:transition-none lg:[[data-header-hidden]_&]:top-6">
      <details key={current.href} open={defaultOpen} className="group rounded-lg border border-border bg-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4.5 py-3 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-xs text-muted-foreground">{data.root.title}</span>
            <span className="block truncate font-heading text-base font-semibold">{current.title}</span>
          </span>
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden
          />
        </summary>
        <nav aria-label={data.root.title} className="border-t border-border px-4.5 py-4.5">
          <SidebarLinks {...data} current={current.href} />
        </nav>
      </details>
      <nav aria-label={data.root.title} className="hidden lg:block">
        <SidebarLinks {...data} current={current.href} />
      </nav>
    </aside>
  )
}
