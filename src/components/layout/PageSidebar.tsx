import { ArrowLeft, ChevronDown } from 'lucide-react'
import NextLink from 'next/link'

import { pagePath } from '@/lib/preview'
import { getPageChildren } from '@/lib/queries'
import { cn } from '@/lib/utils'
import type { Page } from '@/payload-types'

type SidebarData = {
  root: Pick<Page, 'title' | 'slug' | 'breadcrumbs'>
  items: Pick<Page, 'id' | 'title' | 'slug' | 'breadcrumbs'>[]
}

/** The section a page belongs to: itself if it has subpages, otherwise its parent. Null if it stands alone. */
export const getSidebarData = async (page: Page): Promise<SidebarData | null> => {
  if (!page.showSidebar) return null
  const children = await getPageChildren(page.id)
  if (children.length) return { root: page, items: children }
  if (typeof page.parent !== 'object' || !page.parent) return null
  return { root: page.parent, items: await getPageChildren(page.parent.id) }
}

const itemClass = (active: boolean) =>
  cn(
    '-ml-px block border-l-2 py-1.5 pl-4 transition-colors hover:text-seal-700',
    active ? 'border-seal-600 font-semibold text-seal-700' : 'border-transparent text-muted-foreground',
  )

function SidebarLinks({ root, items, current }: SidebarData & { current: number }) {
  const parent = root.breadcrumbs?.at(-2)
  return (
    <>
      {parent?.url && (
        <NextLink
          href={parent.url}
          className="mb-4.5 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-seal-700"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Kembali ke {parent.label}
        </NextLink>
      )}
      <NextLink href={pagePath(root)} className="block font-heading text-h3 transition-colors hover:text-seal-700">
        {root.title}
      </NextLink>
      <ul className="mt-3 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <NextLink
              href={pagePath(item)}
              aria-current={item.id === current ? 'page' : undefined}
              className={itemClass(item.id === current)}
            >
              {item.title}
            </NextLink>
          </li>
        ))}
      </ul>
    </>
  )
}

/** Sticky list on desktop, collapsed dropdown on smaller screens. */
export function PageSidebar({ data, page }: { data: SidebarData; page: Page }) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto lg:transition-[top] lg:duration-300 lg:motion-reduce:transition-none lg:[[data-header-hidden]_&]:top-6">
      <details key={page.id} className="group rounded-lg border border-border bg-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4.5 py-3 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-xs text-muted-foreground">{data.root.title}</span>
            <span className="block truncate font-heading text-base font-semibold">{page.title}</span>
          </span>
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden
          />
        </summary>
        <nav aria-label={data.root.title} className="border-t border-border px-4.5 py-4.5">
          <SidebarLinks {...data} current={page.id} />
        </nav>
      </details>
      <nav aria-label={data.root.title} className="hidden lg:block">
        <SidebarLinks {...data} current={page.id} />
      </nav>
    </aside>
  )
}
