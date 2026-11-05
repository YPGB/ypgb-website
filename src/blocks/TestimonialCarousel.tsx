'use client'

import { Children, type ReactNode } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

/** Draggable, with the next card peeking in. No autoplay: visitors read at their own pace. */
export function TestimonialCarousel({ children }: { children: ReactNode }) {
  const cards = Children.toArray(children)
  return (
    <Carousel opts={{ align: 'start' }} className="min-w-0">
      <CarouselContent>
        {cards.map((card, i) => (
          <CarouselItem key={i} className={cards.length > 1 ? 'basis-[88%]' : undefined}>
            {card}
          </CarouselItem>
        ))}
      </CarouselContent>
      {cards.length > 1 && (
        <div className="mt-4.5 flex gap-2">
          <CarouselPrevious size="icon-lg" className="static inset-auto my-0 translate-y-0" aria-label="Sebelumnya" />
          <CarouselNext size="icon-lg" className="static inset-auto my-0 translate-y-0" aria-label="Berikutnya" />
        </div>
      )}
    </Carousel>
  )
}
