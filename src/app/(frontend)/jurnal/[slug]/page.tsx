import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DownloadButton } from '@/components/cards/FileRow'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'
import { Media, toSrc } from '@/components/Media'
import { JournalReader } from '@/components/pdf/JournalReader'
import { Container } from '@/components/Section'
import { formatDate } from '@/lib/format'
import { JOURNAL_ROOT } from '@/lib/preview'
import { getJournal, getJournalList, getPage } from '@/lib/queries'
import { mediaUrl } from '@/lib/site-settings'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await getJournalList()).map((journal) => ({ slug: journal.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journal = await getJournal(decodeURIComponent((await params).slug))
  if (!journal) return {}
  const image = mediaUrl(journal.meta?.image) ?? mediaUrl(journal.coverImage)
  return {
    title: journal.meta?.title || journal.title,
    description: journal.meta?.description || journal.abstract || undefined,
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function JournalPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug)
  const [journal, root] = await Promise.all([getJournal(slug), getPage(JOURNAL_ROOT)])
  if (!journal) notFound()
  const pdf = typeof journal.pdf === 'object' ? journal.pdf : null
  const details = [journal.issue, formatDate(journal.publishedAt), journal.issn && `ISSN ${journal.issn}`]
    .filter(Boolean)
    .join(' · ')
  const hasCover = typeof journal.coverImage === 'object' && journal.coverImage?.url

  return (
    <article className="pb-18 md:pb-26">
      <PageBreadcrumb ancestors={[{ label: root?.title ?? 'Jurnal', url: `/${JOURNAL_ROOT}` }]} current={journal.title} />
      <Container className="flex flex-col gap-13 pt-13 md:pt-18">
        <header className={hasCover ? 'grid items-start gap-9 md:grid-cols-[14rem_minmax(0,1fr)]' : undefined}>
          {hasCover && (
            <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-xl bg-muted shadow-sm md:w-full">
              <Media media={journal.coverImage} sizes="(min-width: 768px) 224px, 160px" priority />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-h1 md:text-display-2">{journal.title}</h1>
            <p className="mt-4.5 text-muted-foreground">{details}</p>
            {journal.abstract && (
              <p className="mt-6.5 max-w-(--container-prose) text-base whitespace-pre-line">{journal.abstract}</p>
            )}
            {pdf && (
              <div className="mt-6.5">
                <DownloadButton file={pdf} label="Unduh PDF" />
              </div>
            )}
          </div>
        </header>
        {pdf?.url && (
          <JournalReader
            url={toSrc(pdf.url)}
            articles={journal.articles}
            fallback={
              <>
                <p className="mb-3 text-muted-foreground">Pratinjau tidak dapat dimuat.</p>
                <DownloadButton file={pdf} label="Unduh PDF" />
              </>
            }
          />
        )}
      </Container>
    </article>
  )
}
