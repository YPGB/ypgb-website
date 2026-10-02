import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import { pathFor } from '@/lib/preview'
import { cn } from '@/lib/utils'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const { relationTo, value } = linkNode.fields.doc ?? {}
      const slug = typeof value === 'object' ? (value as { slug?: string }).slug : null
      if (relationTo === 'news') return pathFor('news', slug)
      return pathFor('pages', slug)
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
