'use client'

import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState } from 'react'

import { Media } from '@/components/Media'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc } from '@/payload-types'

const SIZES = '(min-width: 1120px) 520px, (min-width: 768px) 45vw, 100vw'

export function HeroCarousel({ images }: { images: MediaDoc[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [plugins] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? []
      : [Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnFocusIn: true, stopOnInteraction: false })],
  )

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} plugins={plugins} className="group/hero">
      <CarouselContent className="ml-0">
        {images.map((img, i) => (
          <CarouselItem key={img.id} className="pl-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10">
              <Media media={img} sizes={SIZES} priority={i === 0} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 border-white/40 bg-black/30 text-white hover:bg-black/50" />
      <CarouselNext className="right-3 border-white/40 bg-black/30 text-white hover:bg-black/50" />
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === current}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'h-2 rounded-full transition-all',
              i === current ? 'w-5.5 bg-white' : 'w-2 bg-white/50 hover:bg-white/75',
            )}
          />
        ))}
      </div>
    </Carousel>
  )
}
