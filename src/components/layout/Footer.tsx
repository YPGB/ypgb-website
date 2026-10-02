import NextLink from 'next/link'

import { CMSLink } from '@/components/CMSLink'
import { Lockup } from '@/components/Lockup'
import { getNavigation } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'

export async function Footer() {
  const [nav, settings] = await Promise.all([getNavigation(), getSiteSettings()])
  const columns = nav.footerColumns ?? []

  return (
    <footer data-tone="dark" className="bg-brand-deep text-brand-foreground/85">
      <div className="mx-auto grid w-full max-w-site gap-9 px-6 pt-18 pb-9 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <NextLink href="/" aria-label={settings.name} className="w-fit text-brand-foreground">
            <Lockup settings={settings} size="md" />
          </NextLink>
          {settings.description && <p className="max-w-xs leading-relaxed">{settings.description}</p>}
          {settings.address && <p className="max-w-xs whitespace-pre-line text-xs opacity-70">{settings.address}</p>}
        </div>
        {columns.map((col) => (
          <div key={col.id ?? col.title} className="flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-[0.08em] opacity-60">{col.title}</div>
            <ul className="flex flex-col gap-3">
              {(col.links ?? []).map((l) => (
                <li key={l.id}>
                  <CMSLink
                    link={l.link}
                    asButton={false}
                    className="text-brand-foreground/85 transition-colors hover:text-wheat-300"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-site flex-col gap-1 px-6 py-4.5 text-xs opacity-60 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings.name}
          </span>
          {nav.bottomText && <span>{nav.bottomText}</span>}
        </div>
      </div>
    </footer>
  )
}
