import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AlbumGallery } from '@/components/gallery/AlbumGallery'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'
import { toSrc } from '@/components/Media'
import { Container } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { ALBUM_ROOT } from '@/lib/preview'
import { getAlbum, getAlbumList, getPage } from '@/lib/queries'
import { mediaUrl } from '@/lib/site-settings'
import type { GalleryImage } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

const isImage = (image: GalleryImage | number): image is GalleryImage => typeof image === 'object' && Boolean(image.url)

export async function generateStaticParams() {
  try {
    return (await getAlbumList()).map((album) => ({ slug: album.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await getAlbum(decodeURIComponent((await params).slug))
  if (!album) return {}
  const photo = typeof album.cover === 'object' && album.cover ? album.cover : album.photos.find(isImage)
  const image = mediaUrl(album.meta?.image) ?? (typeof photo === 'object' ? photo.url : undefined)
  return {
    title: album.meta?.title || album.title,
    description: album.meta?.description || undefined,
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function AlbumPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug)
  const [album, root] = await Promise.all([getAlbum(slug), getPage(ALBUM_ROOT)])
  if (!album) notFound()
  const unit = typeof album.unit === 'object' ? album.unit : null
  const details = [formatDate(album.publishedAt), unit?.name].filter(Boolean).join(' · ')
  const photos = album.photos.filter(isImage).map((photo, i) => ({
    id: photo.id,
    src: toSrc(photo.url ?? ''),
    alt: photo.alt || `${album.title}, foto ${i + 1}`,
    position: `${photo.focalX ?? 50}% ${photo.focalY ?? 50}%`,
  }))

  return (
    <article className="pb-18 md:pb-26">
      <PageBreadcrumb ancestors={[{ label: root?.title ?? 'Galeri', url: `/${ALBUM_ROOT}` }]} current={album.title} />
      <Container className="flex flex-col gap-9 pt-13 md:pt-18">
        <header>
          <h1 className="text-h1 md:text-display-2">{album.title}</h1>
          <p className="mt-4.5 text-muted-foreground">{details}</p>
        </header>
        <AlbumGallery title={album.title} photos={photos} />
        {album.moreUrl && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href={album.moreUrl} target="_blank" rel="noopener noreferrer" />}
            >
              Lihat Semua Foto
              <ExternalLink aria-hidden />
            </Button>
          </div>
        )}
      </Container>
    </article>
  )
}
