import NextLink from 'next/link'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/format'
import { pathFor } from '@/lib/preview'
import { cn } from '@/lib/utils'
import type { News } from '@/payload-types'

type Item = Pick<News, 'id' | 'title' | 'slug' | 'publishedAt' | 'category' | 'coverImage' | 'excerpt'>

export function NewsCard({ item, layout = 'grid' }: { item: Item; layout?: 'grid' | 'list' }) {
  const category = typeof item.category === 'object' ? item.category?.title : null
  const row = layout === 'list'
  return (
    <Card
      className={cn(
        'group/news relative gap-0 py-0 transition-[box-shadow,translate] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-md',
        row && 'sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Media media={item.coverImage} sizes={row ? '(min-width: 640px) 40vw, 100vw' : '(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw'} />
        {category && (
          <Badge className="absolute top-3 left-3 bg-seal-600 text-white">{category}</Badge>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4.5">
        <time dateTime={item.publishedAt} className="text-xs text-muted-foreground">
          {formatDate(item.publishedAt)}
        </time>
        <h3 className="line-clamp-3 text-h3">
          <NextLink
            href={pathFor('news', item.slug)}
            className="after:absolute after:inset-0 group-hover/news:text-seal-700"
          >
            {item.title}
          </NextLink>
        </h3>
        {item.excerpt && <p className="line-clamp-3 text-muted-foreground">{item.excerpt}</p>}
      </div>
    </Card>
  )
}
