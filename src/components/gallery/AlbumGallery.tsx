'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

type Photo = { id: number; src: string; alt: string; position: string }

/** Uniform 4:3 tiles; a tile opens the album in a lightbox at that photo. */
export function AlbumGallery({ title, photos }: { title: string; photos: Photo[] }) {
  const [start, setStart] = useState(0)
  const [open, setOpen] = useState(false)

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4.5 xl:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => {
                setStart(i)
                setOpen(true)
              }}
              aria-label={`Buka ${photo.alt}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                style={{ objectPosition: photo.position }}
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-1rem)] gap-0 bg-black p-3 text-white ring-0 sm:max-w-6xl md:px-14 [&_[data-slot=dialog-close]]:z-10 [&_[data-slot=dialog-close]]:text-white">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <Carousel opts={{ startIndex: start }} aria-label={title}>
            <CarouselContent>
              {photos.map((photo) => (
                <CarouselItem key={photo.id}>
                  <div className="relative h-[75svh] w-full">
                    <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious size="icon" className="left-1 md:-left-12" />
            <CarouselNext size="icon" className="right-1 md:-right-12" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  )
}
