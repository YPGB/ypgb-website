import { ExternalLink } from 'lucide-react'
import NextLink from 'next/link'

import { resolveHref, type LinkData } from '@/components/CMSLink'
import { Lockup } from '@/components/Lockup'
import { Container } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { heroSitsUnderHeader } from '@/heros/overlay'
import { getNavigation, getPage } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'

import { HeaderShell } from './HeaderShell'
import { NavPanel, type NavItem } from './NavPanel'

const toItem = (link?: LinkData | null): NavItem | null => {
  const href = resolveHref(link)
  if (!href || !link?.label) return null
  return { label: link.label, href, newTab: Boolean(link.newTab), external: link.type === 'external' }
}

const toItems = (rows?: { link?: LinkData | null }[] | null): NavItem[] =>
  (rows ?? []).map((row) => toItem(row.link)).filter((item): item is NavItem => !!item)

export async function Header() {
  const [nav, settings, home] = await Promise.all([getNavigation(), getSiteSettings(), getPage('home')])
  const button = nav.hasHeaderButton ? toItem(nav.headerButton) : null

  const items = (nav.headerItems ?? []).flatMap((row) => {
    const item = toItem(row.link)
    return item ? [{ ...item, children: toItems(row.children) }] : []
  })
  const groups = (nav.linkGroups ?? []).map((group) => ({ title: group.title, links: toItems(group.links) }))
  const socials = (settings.socials ?? []).map((social) => ({ platform: social.platform, href: social.url }))

  const barLinks = (nav.headerItems ?? []).flatMap((row) => {
    const item = row.showInBar ? toItem(row.link) : null
    return item ? [item] : []
  })

  // Two versions, swapped by CSS: the header tone changes while scrolling, and the panel is always dark.
  const logo = (
    <NextLink href="/" aria-label={settings.name} className="min-w-0">
      <Lockup settings={settings} onDark={false} className="in-data-[tone=dark]:hidden" />
      <Lockup settings={settings} className="hidden in-data-[tone=dark]:inline-flex" />
    </NextLink>
  )
  const buttonNode = button && (
    <Button
      nativeButton={false}
      className="shrink-0"
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
  )

  return (
    <HeaderShell overlayHome={heroSitsUnderHeader(home?.hero)}>
      <Container className="flex h-18 items-center justify-between gap-3 md:gap-6">
        {logo}
        <div className="flex shrink-0 items-center gap-2">
          {barLinks.length > 0 && (
            <nav aria-label="Tautan cepat" className="hidden items-center gap-1 lg:flex">
              {barLinks.map((item) => (
                <Button
                  key={item.href + item.label}
                  variant="ghost"
                  nativeButton={false}
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
            </nav>
          )}
          {buttonNode}
          <NavPanel
            title={settings.wordmark}
            logo={logo}
            button={buttonNode}
            items={items}
            secondary={toItems(nav.secondaryLinks)}
            groups={groups}
            socials={socials}
          />
        </div>
      </Container>
    </HeaderShell>
  )
}
