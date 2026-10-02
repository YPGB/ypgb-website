import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

const countAccents = (value: unknown): number => {
  if (Array.isArray(value)) return value.reduce((n: number, v) => n + countAccents(v), 0)
  if (!value || typeof value !== 'object') return 0
  const obj = value as Record<string, unknown>
  return (obj.appearance === 'accent' ? 1 : 0) + countAccents(Object.values(obj))
}

/** Wax-seal accent is one deliberate moment per page: block publishing with more than one. */
export const limitAccentButtons: CollectionBeforeValidateHook = ({ data, collection }) => {
  if (data?._status === 'published' && countAccents(data) > 1) {
    throw new ValidationError({
      collection: collection.slug,
      errors: [
        {
          message: 'Only one "Accent" button is allowed per page. Change the others to Primary or Secondary.',
          path: 'hero',
        },
      ],
    })
  }
  return data
}
