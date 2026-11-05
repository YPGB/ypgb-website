'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

const HEADER_HEIGHT = 72
const SCROLL_TOLERANCE = 8

/** Parchment. Hides on scroll down, returns on scroll up. Transparent at the very top of the home hero (`overlayHome`). */
export function HeaderShell({ overlayHome, children }: { overlayHome: boolean; children: ReactNode }) {
  const pathname = usePathname()
  const overlay = overlayHome && pathname === '/'
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    let last = Math.max(0, window.scrollY)
    let queued = false
    const update = () => {
      queued = false
      const y = Math.max(0, window.scrollY)
      setAtTop(y <= SCROLL_TOLERANCE)
      if (Math.abs(y - last) < SCROLL_TOLERANCE) return
      setHidden(y > last && y > HEADER_HEIGHT)
      last = y
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lets the sticky page sidebar move up into the freed space.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', hidden)
  }, [hidden])

  const transparent = overlay && atTop

  return (
    <header
      data-tone={transparent ? 'dark' : undefined}
      className={cn(
        'sticky top-0 z-50 border-b transition-[translate,background-color,color,border-color] duration-300 motion-reduce:transition-none',
        transparent ? 'border-transparent bg-transparent text-brand-foreground' : 'border-border bg-background text-foreground',
        overlay && '-mb-[calc(--spacing(18)+1px)]', // height of the bar plus its 1px border
        hidden && '-translate-y-full has-focus-visible:translate-y-0',
      )}
    >
      {children}
    </header>
  )
}
