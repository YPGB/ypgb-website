import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

type Doc = { id: number | string; _status?: 'draft' | 'published' | null }

/** Revalidate a cache tag when a document is published, unpublished or deleted (draft autosaves are ignored). */
export const revalidateOnChange = (tag: string): NonNullable<CollectionConfig['hooks']> => {
  const afterChange: CollectionAfterChangeHook<Doc> = ({ doc, previousDoc, req: { context } }) => {
    if (context.disableRevalidate) return doc
    const versioned = doc._status !== undefined
    if (!versioned || doc._status === 'published' || previousDoc?._status === 'published') {
      revalidateTag(tag, { expire: 0 })
    }
    return doc
  }
  const afterDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) revalidateTag(tag, { expire: 0 })
    return doc
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}
