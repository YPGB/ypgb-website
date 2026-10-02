import type { SelectField } from 'payload'

/** Lucide icon names (kebab-case) editors may choose from. */
export const ICONS = [
  'graduation-cap',
  'school',
  'book-open-text',
  'library',
  'users',
  'user-round',
  'baby',
  'heart-handshake',
  'hand-heart',
  'church',
  'award',
  'trophy',
  'star',
  'sparkles',
  'lightbulb',
  'target',
  'eye',
  'calendar-days',
  'clock',
  'newspaper',
  'map-pin',
  'phone',
  'mail',
] as const

export type IconName = (typeof ICONS)[number]

export const icon = (overrides: Partial<SelectField> = {}): SelectField =>
  ({
    name: 'icon',
    type: 'select',
    options: ICONS.map((value) => ({ label: value, value })),
    ...overrides,
  }) as SelectField
