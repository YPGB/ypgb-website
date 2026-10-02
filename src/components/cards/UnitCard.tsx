import { Award, ExternalLink, MapPin, Phone, UserRound } from 'lucide-react'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Unit } from '@/payload-types'

export function UnitCard({ unit }: { unit: Unit }) {
  const rows = [
    { icon: MapPin, text: unit.address },
    { icon: UserRound, text: unit.principal },
    { icon: Award, text: unit.accreditation },
    { icon: Phone, text: unit.phone },
  ].filter((r) => r.text)
  const hasPhoto = typeof unit.photo === 'object' && unit.photo?.url

  return (
    <Card className="h-full gap-0 py-0">
      <div className="relative flex aspect-[16/9] items-end justify-between bg-brand p-4.5 text-brand-foreground">
        {hasPhoto && (
          <>
            <Media media={unit.photo} sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-umber-950/85 to-umber-950/10" />
          </>
        )}
        <span className="relative font-display text-h2 font-black uppercase leading-none">{unit.abbreviation}</span>
        <Badge className="relative bg-white/20 text-white">{unit.level}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4.5">
        <h3 className="text-h3 leading-snug">{unit.name}</h3>
        {rows.length > 0 && (
          <ul className="flex flex-col gap-1.5 text-muted-foreground">
            {rows.map(({ icon: I, text }) => (
              <li key={text} className="flex items-start gap-2">
                <I className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span className="min-w-0 whitespace-pre-line">{text}</span>
              </li>
            ))}
          </ul>
        )}
        {unit.website && (
          <a
            href={unit.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold hover:text-seal-700"
          >
            Kunjungi website <ExternalLink className="size-3.5" aria-hidden />
          </a>
        )}
      </div>
    </Card>
  )
}
