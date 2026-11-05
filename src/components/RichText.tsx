import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import { newsPath, pagePath } from '@/lib/preview'
import { cn } from '@/lib/utils'

import { blockConverters } from './richtext/blockConverters'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: blockConverters as never,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const { relationTo, value } = linkNode.fields.doc ?? {}
      const doc = typeof value === 'object' ? (value as { slug?: string }) : null
      if (relationTo === 'news') return newsPath(doc?.slug)
      return pagePath(doc)
    },
  }),
})

export function RichText({
  data,
  className,
  invert,
}: {
  data?: SerializedEditorState | null
  className?: string
  invert?: boolean
}) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data}
      converters={converters}
      className={cn('prose prose-brand max-w-none', invert && 'prose-invert', className)}
    />
  )
}
