import type { Metadata } from 'next'
import { Figtree, Geist, Newsreader, Source_Serif_4 } from 'next/font/google'
import { draftMode } from 'next/headers'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LivePreviewListener } from '@/components/layout/LivePreviewListener'
import { FALLBACK_LOGO, getSiteSettings, mediaUrl } from '@/lib/site-settings'
import { cn } from '@/lib/utils'
import './styles.css'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' })
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-source-serif',
})
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const icon = mediaUrl(settings.favicon) ?? mediaUrl(settings.logo) ?? FALLBACK_LOGO
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: settings.name, template: `%s | ${settings.name}` },
    description: settings.description ?? undefined,
    icons: { icon },
    openGraph: { siteName: settings.name, locale: 'id_ID', type: 'website' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()

  return (
    <html lang="id" data-scroll-behavior="smooth" className={cn(figtree.variable, sourceSerif.variable, geist.variable, newsreader.variable)}>
      <body className="flex min-h-screen flex-col">
        {draft && (
          <>
            <LivePreviewListener />
            <div className="bg-seal-700 px-6 py-1.5 text-center text-xs text-white">
              Mode pratinjau (draft) aktif ·{' '}
              <a href="/next/exit-preview" className="font-semibold underline-offset-2 hover:underline">
                Keluar
              </a>
            </div>
          </>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
