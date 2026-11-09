'use client'

import { ChevronDown, Search, X } from 'lucide-react'
import Form from 'next/form'
import NextLink from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { archiveHref, type ArchiveState } from './ArchiveNav'

const field =
  'h-10 rounded-lg border border-input bg-card text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

/**
 * Search, year and (optionally) unit, as a GET form: works without JavaScript, and with it `next/form` navigates on
 * the client. The dropdowns apply on change; the search applies on Enter or the button. The category stays as is.
 */
export function ArchiveFilters({
  basePath,
  state,
  years,
  units,
  placeholder = 'Cari…',
}: {
  basePath: string
  state: ArchiveState
  years: number[]
  units?: { id: number; name: string }[]
  placeholder?: string
}) {
  const filtered = Boolean(state.cari || state.tahun || state.unit)
  const submit = (e: React.ChangeEvent<HTMLSelectElement>) => e.currentTarget.form?.requestSubmit()

  return (
    <Form action={basePath} scroll={false} role="search" className="flex flex-wrap items-center gap-2">
      {state.kategori && <input type="hidden" name="kategori" value={state.kategori} />}
      <div className="relative min-w-0 flex-1 basis-60">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          // Remount when the URL changes, so Reset and the back button clear what was typed.
          key={state.cari ?? ''}
          type="search"
          name="cari"
          defaultValue={state.cari ?? ''}
          placeholder={placeholder}
          aria-label="Cari"
          maxLength={80}
          className={cn(field, 'w-full pr-3 pl-9 placeholder:text-muted-foreground')}
        />
      </div>
      {years.length > 0 && (
        <Select name="tahun" label="Tahun" value={state.tahun} onChange={submit}>
          <option value="">Semua tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      )}
      {units && units.length > 0 && (
        <Select name="unit" label="Unit" value={state.unit} onChange={submit}>
          <option value="">Semua unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      )}
      <Button type="submit" size="lg" className="h-10">
        Cari
      </Button>
      {filtered && (
        <Button
          variant="ghost"
          size="lg"
          className="h-10"
          nativeButton={false}
          render={<NextLink href={archiveHref(basePath, { kategori: state.kategori })} scroll={false} />}
        >
          <X aria-hidden />
          Reset
        </Button>
      )}
    </Form>
  )
}

function Select({
  name,
  label,
  value,
  onChange,
  children,
}: {
  name: string
  label: string
  value?: null | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        key={value ?? ''}
        name={name}
        aria-label={label}
        defaultValue={value ?? ''}
        onChange={onChange}
        className={cn(field, 'appearance-none pr-9 pl-3')}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
    </div>
  )
}
