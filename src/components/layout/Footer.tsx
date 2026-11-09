import { Mail, Phone } from 'lucide-react'
import NextLink from 'next/link'
import { Whatsapp } from 'react-bootstrap-icons'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { CMSLink } from '@/components/CMSLink'
import { Lockup } from '@/components/Lockup'
import { Container } from '@/components/Section'
import { SocialIcon, socialLabel } from '@/components/SocialIcon'
import { getNavigation } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'

const hover = 'transition-colors hover:text-wheat-300'
const contactLink = 'inline-flex w-fit items-center gap-2 break-all'

export async function Footer() {
  const [nav, settings] = await Promise.all([getNavigation(), getSiteSettings()])
  const groups = nav.footerColumns ?? []
  const phones = settings.phones ?? []
  const socials = settings.socials ?? []

  return (
    <>
      <RenderBlocks blocks={nav.footerBlocks} ctx={{ path: '/' }} />
      <footer data-tone="dark" className="bg-brand-deep text-brand-foreground/85">
        <Container className="grid gap-9 pt-18 pb-13 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-13">
          <div className="flex flex-col gap-4.5">
            <NextLink href="/" aria-label={settings.name} className="w-fit text-brand-foreground">
              <Lockup settings={settings} size="md" />
            </NextLink>
            {settings.description && <p className="max-w-xs leading-relaxed">{settings.description}</p>}
            {(settings.address || phones.length > 0 || settings.whatsapp || settings.email) && (
              <address className="flex max-w-xs flex-col gap-1.5 not-italic">
                {settings.address && <p className="mb-1.5 whitespace-pre-line">{settings.address}</p>}
                {phones.map((phone) => (
                  <a
                    key={phone.id ?? phone.number}
                    href={`tel:${phone.number.replace(/[^\d+]/g, '')}`}
                    className={`${contactLink} ${hover}`}
                  >
                    <Phone className="size-4 shrink-0" aria-hidden />
                    {phone.number}
                  </a>
                ))}
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp +${settings.whatsapp}`}
                    className={`${contactLink} ${hover}`}
                  >
                    <Whatsapp className="size-4 shrink-0" aria-hidden />+{settings.whatsapp}
                  </a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className={`${contactLink} ${hover}`}>
                    <Mail className="size-4 shrink-0" aria-hidden />
                    {settings.email}
                  </a>
                )}
              </address>
            )}
            {settings.mapEmbedUrl && (
              <iframe
                src={settings.mapEmbedUrl}
                title={`Peta lokasi ${settings.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-video w-full rounded-lg border-0 bg-white/10 lg:max-w-xs"
              />
            )}
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-4.5">
                {socials.map((social) => (
                  <li key={social.id ?? social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialLabel(social.platform)}
                      className={`block ${hover}`}
                    >
                      <SocialIcon platform={social.platform} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {groups.length > 0 && (
            <div className="gap-9 sm:columns-2 lg:columns-3 xl:columns-4">
              {groups.map((group) => (
                <div key={group.id ?? group.title} className="mb-9 break-inside-avoid last:mb-0">
                  <h2 className="mb-3 font-heading text-base font-semibold text-brand-foreground">{group.title}</h2>
                  <ul className="flex flex-col gap-2.5">
                    {(group.links ?? []).map((l) => (
                      <li key={l.id}>
                        <CMSLink link={l.link} asButton={false} className={hover} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Container>
        <div className="border-t border-white/10">
          <Container className="flex flex-col gap-1 py-4.5 text-xs opacity-60 sm:flex-row sm:justify-between">
            <span>
              © {new Date().getFullYear()} {settings.name}
            </span>
            {nav.bottomText && <span>{nav.bottomText}</span>}
          </Container>
        </div>
      </footer>
    </>
  )
}
