'use client'

import type { ReactNode } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsClient({ items }: { items: { id: string; label: string; content: ReactNode }[] }) {
  if (!items.length) return null
  return (
    <Tabs defaultValue={items[0].id} className="gap-4.5">
      <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
        {items.map((t) => (
          <TabsTrigger
            key={t.id}
            value={t.id}
            className="h-9 flex-none rounded-full border border-border bg-card px-4.5 data-active:border-primary data-active:bg-primary data-active:text-primary-foreground"
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((t) => (
        <TabsContent
          key={t.id}
          value={t.id}
          className="relative rounded-xl border border-border bg-muted p-6.5 before:absolute before:top-6.5 before:bottom-6.5 before:left-0 before:w-[3px] before:rounded-r-sm before:bg-seal-600 md:p-9"
        >
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
