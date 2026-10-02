'use client'

import { ExternalLink, Menu } from 'lucide-react'
import NextLink from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export type NavItem = { label: string; href: string; newTab: boolean; external: boolean }

export function MobileNav({ items, button, title }: { items: NavItem[]; button?: NavItem | null; title: string }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-lg" aria-label="Buka menu" className="text-brand-foreground lg:hidden" />
        }
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm bg-background">
        <SheetHeader>
          <SheetTitle className="font-heading text-h3">{title}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col px-4">
          {items.map((item) => (
            <NextLink
              key={item.href + item.label}
              href={item.href}
              onClick={close}
              target={item.newTab ? '_blank' : undefined}
              rel={item.newTab ? 'noopener noreferrer' : undefined}
              className="flex h-11 items-center justify-between border-b border-border text-base font-medium hover:text-seal-700"
            >
              {item.label}
              {item.external && item.newTab && <ExternalLink className="size-4 opacity-60" />}
            </NextLink>
          ))}
        </nav>
        {button && (
          <div className="mt-auto p-4">
            <Button
              size="xl"
              className="w-full"
              nativeButton={false}
              onClick={close}
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
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
