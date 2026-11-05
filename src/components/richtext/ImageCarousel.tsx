'use client'

import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { Media as MediaDoc } from '@/payload-types'

const SIZES = '(min-width: 1024px) 960px, 100vw'
const arrow = 'static inset-auto my-0 translate-y-0'

/** Arrows sit below the photos on the right, outside the image. No autoplay: this sits between paragraphs. */
export function ImageCarousel({ images, caption }: { images: MediaDoc[]; caption?: string | null }) {
  const many = images.length > 1
  return (
    <Carousel opts={{ loop: many, watchDrag: many }} className="[&>[data-slot=carousel-content]]:rounded-xl">
      <CarouselContent className="ml-0">
        {images.map((image) => (
          <CarouselItem key={image.id} className="pl-0">
            <div className="relative aspect-video bg-muted">
              <Media media={image} sizes={SIZES} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {(caption || many) && (
        <div className="mt-3 flex items-start justify-between gap-4.5">
          <p className="min-w-0 text-muted-foreground in-data-[tone=dark]:text-white/75">{caption}</p>
          {many && (
            <div className="flex shrink-0 gap-2">
              <CarouselPrevious className={arrow} aria-label="Foto sebelumnya" />
              <CarouselNext className={arrow} aria-label="Foto berikutnya" />
            </div>
          )}
        </div>
      )}
    </Carousel>
  )
}
