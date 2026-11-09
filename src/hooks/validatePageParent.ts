import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

import { ALBUM_ROOT, JOURNAL_ROOT, PRAYER_ROOT } from '@/lib/preview'

/** `/` has no path to nest under; the others have routes of their own for the URLs below them. */
export const ROOT_ONLY = ['home', 'berita', PRAYER_ROOT, JOURNAL_ROOT, ALBUM_ROOT]

const refuse = (message: string) => new ValidationError({ errors: [{ path: 'parent', message }] })

/**
 * Runs before validation on purpose: the nested-docs plugin walks the parent chain in `beforeChange`,
 * ahead of field validation, so a parent loop would hang there forever if it weren't refused first.
 */
export const validatePageParent: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  const parent = data?.parent as number | { id: number } | null | undefined
  if (!parent) return data

  if (ROOT_ONLY.includes(data?.slug ?? originalDoc?.slug)) throw refuse('This page must stay at the top level.')

  const seen = new Set<number>()
  let current: number | null = typeof parent === 'object' ? parent.id : parent
  while (current) {
    if (current === originalDoc?.id || seen.has(current)) {
      throw refuse('A page cannot be nested under itself or one of its own subpages.')
    }
    seen.add(current)
    const ancestor: { slug?: string | null; parent?: number | { id: number } | null } = await req.payload.findByID({
      collection: 'pages',
      id: current,
      depth: 0,
      draft: true,
      req,
      select: { slug: true, parent: true },
    })
    if (ancestor.slug && ROOT_ONLY.includes(ancestor.slug)) throw refuse(`Pages cannot be nested under "${ancestor.slug}".`)
    current = typeof ancestor.parent === 'object' ? (ancestor.parent?.id ?? null) : (ancestor.parent ?? null)
  }
  return data
}
