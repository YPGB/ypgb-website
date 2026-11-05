'use client'

import { Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
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

const INTERVAL_MS = 6000

const arrow = 'static inset-auto my-0 translate-y-0 border-white/40 bg-black/30 text-white hover:bg-black/50'

/** Full-bleed slideshow behind the hero text. Advances by itself unless paused or reduced motion is requested. */
export function HeroSlides({ images, overlayClassName }: { images: MediaDoc[]; overlayClassName: string }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const many = images.length > 1

  useEffect(() => {
    setPlaying(many && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [many])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  // Restarts on every slide change, so a manual change also gets a full interval.
  useEffect(() => {
    if (!api || !playing) return
    const timer = setTimeout(() => api.scrollNext(), INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [api, playing, current])

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, watchDrag: many }}
      className="absolute inset-0 -z-10 [&>[data-slot=carousel-content]]:h-full"
    >
      <CarouselContent className="ml-0 h-full">
        {images.map((image, i) => (
          <CarouselItem key={image.id} className="relative h-full pl-0">
            <Media media={image} priority={i === 0} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className={cn('pointer-events-none absolute inset-0', overlayClassName)} />
      {many && (
        <>
          <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3">
            <CarouselPrevious className={arrow} aria-label="Foto sebelumnya" />
            <div className="flex items-center gap-1">
              {images.map((image, i) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`Foto ${i + 1}`}
                  aria-current={i === current}
                  onClick={() => api?.scrollTo(i)}
                  className="flex size-6 items-center justify-center"
                >
                  <span
                    className={cn(
                      'h-2 rounded-full transition-all motion-reduce:transition-none',
                      i === current ? 'w-5.5 bg-white' : 'w-2 bg-white/50 hover:bg-white/75',
                    )}
                  />
                </button>
              ))}
            </div>
            <CarouselNext className={arrow} aria-label="Foto berikutnya" />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={playing ? 'Jeda slideshow' : 'Putar slideshow'}
              onClick={() => setPlaying(!playing)}
              className="text-white"
            >
              {playing ? <Pause /> : <Play />}
            </Button>
          </div>
        </>
      )}
    </Carousel>
  )
}
