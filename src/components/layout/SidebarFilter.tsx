'use client'

import { Search } from 'lucide-react'
import { type ReactNode, useId, useState } from 'react'

/** Lowercase, without accents, so "maria" also finds "María". */
const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/**
 * A search field that narrows a sidebar list as you type, with no reload. Items arrive pre-rendered (server links) with
 * their title, and are only hidden or shown here.
 */
export function SidebarFilter({
  items,
  label,
  placeholder,
}: {
  items: { key: string | number; title: string; node: ReactNode }[]
  label: string
  placeholder: string
}) {
  const [query, setQuery] = useState('')
  const id = useId()
  const words = fold(query).split(/\s+/).filter(Boolean)
  const visible = words.length ? items.filter((item) => words.every((w) => fold(item.title).includes(w))) : items

  return (
    <>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          aria-controls={id}
          className="h-9 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <ul id={id} className="mt-3 border-l border-border">
        {visible.map((item) => (
          <li key={item.key}>{item.node}</li>
        ))}
      </ul>
      {words.length > 0 && (
        <p role="status" className="mt-3 text-muted-foreground">
          {visible.length ? `${visible.length} dari ${items.length}` : `Tidak ada hasil untuk “${query.trim()}”.`}
        </p>
      )}
    </>
  )
}
