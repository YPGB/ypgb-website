import NextLink from 'next/link'

import { Media } from '@/components/Media'
import { newsPath } from '@/lib/preview'
import { getNewsList } from '@/lib/queries'

const COUNT = 3
const POOL = 24

/** Same order every time for a given article, different between articles, so the page stays cacheable. */
const shuffleScore = (newsId: number, seed: number) => {
  const x = Math.sin(newsId * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Side column on article pages: a varied selection of other published articles. */
export async function RelatedNews({ articleId }: { articleId: number }) {
  const { docs } = await getNewsList({ limit: POOL })
  const items = docs
    .filter((news) => news.id !== articleId)
    .sort((a, b) => shuffleScore(a.id, articleId) - shuffleScore(b.id, articleId))
    .slice(0, COUNT)
  if (!items.length) return null

  return (
    <aside className="mt-13 xl:sticky xl:top-24 xl:mt-0 xl:self-start xl:transition-[top] xl:duration-300 xl:motion-reduce:transition-none xl:[[data-header-hidden]_&]:top-6">
      <h2 className="border-b border-border pb-3 text-h3">Berita Lainnya</h2>
      <ul>
        {items.map((news) => (
          <li key={news.id} className="group relative flex gap-3.5 border-b border-border py-3.5">
            <div className="relative size-18 shrink-0 overflow-hidden rounded-md bg-muted">
              <Media media={news.coverImage} sizes="72px" />
            </div>
            <NextLink
              href={newsPath(news.slug)}
              className="line-clamp-3 min-w-0 font-heading text-base font-semibold leading-snug transition-colors group-hover:text-seal-700 after:absolute after:inset-0"
            >
              {news.title}
            </NextLink>
          </li>
        ))}
      </ul>
      <NextLink href="/berita" className="mt-3.5 block text-center text-muted-foreground transition-colors hover:text-seal-700">
        Lihat semua berita
      </NextLink>
    </aside>
  )
}
