'use client'

import { ChevronRight, ExternalLink, Menu, X } from 'lucide-react'
import NextLink from 'next/link'
import { useState, type ReactNode } from 'react'

import { Container } from '@/components/Section'
import { SocialIcon, socialLabel, type SocialPlatform } from '@/components/SocialIcon'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export type NavItem = { label: string; href: string; newTab: boolean; external: boolean }
export type NavMenuItem = NavItem & { children: NavItem[] }
export type NavGroup = { title: string; links: NavItem[] }

const hover = 'transition-colors hover:text-wheat-300'

function PanelLink({ item, onClick, className }: { item: NavItem; onClick: () => void; className?: string }) {
  return (
    <NextLink
      href={item.href}
      onClick={onClick}
      target={item.newTab ? '_blank' : undefined}
      rel={item.newTab ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {item.label}
      {item.external && item.newTab && <ExternalLink className="ml-2 inline size-4 opacity-60" aria-hidden />}
    </NextLink>
  )
}

function SecondaryList({ links, onClick }: { links: NavItem[]; onClick: () => void }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <PanelLink item={link} onClick={onClick} className={`text-base text-brand-foreground/85 ${hover}`} />
        </li>
      ))}
    </ul>
  )
}

/** Full-screen menu at every width: main items with submenus, plus secondary links, groups and socials. */
export function NavPanel({
  title,
  logo,
  button,
  items,
  secondary,
  groups,
  socials,
}: {
  title: string
  logo: ReactNode
  button: ReactNode
  items: NavMenuItem[]
  secondary: NavItem[]
  groups: NavGroup[]
  socials: { platform: SocialPlatform; href: string }[]
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const hasSide = secondary.length > 0 || groups.length > 0 || socials.length > 0
  const rowLink = `min-w-0 py-3.5 font-heading text-h3 ${hover}`

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-lg" aria-label="Buka menu" className="shrink-0" />}
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent
        side="top"
        showCloseButton={false}
        data-tone="dark"
        className="gap-0 overflow-y-auto border-0 bg-brand-deep text-brand-foreground shadow-none data-[side=top]:h-svh data-[side=top]:w-screen"
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <Container className="flex h-18 shrink-0 items-center justify-between gap-3 md:gap-6">
          {logo}
          <div className="flex shrink-0 items-center gap-2">
            {button}
            <SheetClose
              render={<Button variant="ghost" size="icon-lg" aria-label="Tutup menu" className="text-brand-foreground" />}
            >
              <X className="size-6" />
            </SheetClose>
          </div>
        </Container>
        <Container className="grid flex-1 content-start gap-9 pt-6.5 pb-13 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-13">
          <nav aria-label="Menu utama" className={hasSide ? 'lg:order-2' : 'lg:col-span-2'}>
            <ul className="border-t border-white/15">
              {items.map((item) => (
                <li key={item.href + item.label} className="border-b border-white/15">
                  {item.children.length ? (
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                        <PanelLink item={item} onClick={close} className={rowLink} />
                        <ChevronRight
                          className="size-5 shrink-0 opacity-70 transition-transform group-open:rotate-90 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </summary>
                      <ul className="flex flex-col gap-2.5 pb-4.5 pl-4.5">
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <PanelLink item={child} onClick={close} className={`text-base text-brand-foreground/85 ${hover}`} />
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <PanelLink item={item} onClick={close} className={`block ${rowLink}`} />
                  )}
                </li>
              ))}
            </ul>
          </nav>
          {hasSide && (
            <div className="flex flex-col gap-9 lg:order-1">
              {secondary.length > 0 && <SecondaryList links={secondary} onClick={close} />}
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 font-heading text-h3">{group.title}</p>
                  <SecondaryList links={group.links} onClick={close} />
                </div>
              ))}
              {socials.length > 0 && (
                <ul className="flex flex-wrap gap-4.5">
                  {socials.map((social) => (
                    <li key={social.href}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLabel(social.platform)}
                        onClick={close}
                        className={`block text-brand-foreground/85 ${hover}`}
                      >
                        <SocialIcon platform={social.platform} className="size-5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Container>
      </SheetContent>
    </Sheet>
  )
}
