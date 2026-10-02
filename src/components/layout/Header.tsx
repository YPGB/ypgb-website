import { ExternalLink } from 'lucide-react'
import NextLink from 'next/link'

import { resolveHref, type LinkData } from '@/components/CMSLink'
import { Lockup } from '@/components/Lockup'
import { Button } from '@/components/ui/button'
import { getNavigation } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'

import { MobileNav, type NavItem } from './MobileNav'

const toItem = (link?: LinkData | null): NavItem | null => {
  const href = resolveHref(link)
  if (!href || !link?.label) return null
  return { label: link.label, href, newTab: Boolean(link.newTab), external: link.type === 'external' }
}

export async function Header() {
  const [nav, settings] = await Promise.all([getNavigation(), getSiteSettings()])
  const items = (nav.headerItems ?? []).map((i) => toItem(i.link)).filter((i): i is NavItem => !!i)
  const button = nav.hasHeaderButton ? toItem(nav.headerButton) : null

  return (
    <header data-tone="dark" className="sticky top-0 z-50 bg-brand text-brand-foreground">
      <div className="mx-auto flex h-18 w-full max-w-site items-center justify-between gap-6 px-6">
        <NextLink href="/" aria-label={settings.name} className="min-w-0">
          <Lockup settings={settings} />
        </NextLink>
        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <Button
              key={item.href + item.label}
              variant="ghost"
              nativeButton={false}
              className="text-sm text-brand-foreground/85"
              render={
                <NextLink
                  href={item.href}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                />
              }
            >
              {item.label}
              {item.external && item.newTab && <ExternalLink data-icon="inline-end" className="opacity-60" />}
            </Button>
          ))}
          {button && (
            <Button
              variant="onbrand"
              className="ml-2"
              nativeButton={false}
              render={
                <NextLink
                  href={button.href}
                  target={button.newTab ? '_blank' : undefined}
                  rel={button.newTab ? 'noopener noreferrer' : undefined}
                />
              }
            >
              {button.label}
            </Button>
          )}
        </nav>
        <MobileNav items={items} button={button} title={settings.wordmark} />
      </div>
    </header>
  )
}
