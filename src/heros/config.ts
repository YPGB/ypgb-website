import type { GroupField } from 'payload'

import { links } from '@/fields/link'

export const HERO_TYPES = ['none', 'split', 'centeredFull', 'centered', 'compact', 'minimal'] as const
export type HeroType = (typeof HERO_TYPES)[number]

const is =
  (...types: HeroType[]) =>
  (_: unknown, siblingData: { type?: HeroType }) =>
    types.includes(siblingData?.type ?? 'none')

export const hero: GroupField = {
  name: 'hero',
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'none',
      required: true,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Split — text beside image/carousel', value: 'split' },
        { label: 'Centered — full screen height', value: 'centeredFull' },
        { label: 'Centered', value: 'centered' },
        { label: 'Compact — short title band', value: 'compact' },
        { label: 'Minimal — large title, no band', value: 'minimal' },
      ],
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'brand',
      required: true,
      options: [
        { label: 'Brand (dark umber)', value: 'brand' },
        { label: 'Brand deep', value: 'brandDeep' },
        { label: 'Warm (sand tint)', value: 'warm' },
      ],
      admin: { condition: is('split', 'centeredFull', 'centered', 'compact') },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional photo behind the text. A fixed dark overlay keeps the text readable.',
        condition: is('centeredFull', 'centered'),
      },
    },
    {
      type: 'row',
      admin: { condition: is('split', 'centeredFull', 'centered', 'compact', 'minimal') },
      fields: [
        { name: 'overline', type: 'text', admin: { width: '35%', placeholder: 'Sejak 1973 · Pontianak' } },
        { name: 'title', type: 'text', required: true, admin: { width: '65%' } },
      ],
    },
    {
      name: 'lead',
      type: 'textarea',
      admin: { condition: is('split', 'centeredFull', 'centered', 'compact', 'minimal') },
    },
    {
      name: 'showBreadcrumb',
      type: 'checkbox',
      defaultValue: true,
      admin: { condition: is('compact') },
    },
    {
      ...links({ maxRows: 2 }),
      admin: { initCollapsed: true, condition: is('split', 'centeredFull', 'centered') },
    },
    {
      type: 'row',
      admin: { condition: is('split') },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          admin: {
            width: '70%',
            description: 'One image shows as a picture; two or more become a carousel.',
          },
        },
        {
          name: 'mediaPosition',
          type: 'radio',
          defaultValue: 'right',
          options: [
            { label: 'Image left', value: 'left' },
            { label: 'Image right', value: 'right' },
          ],
          admin: { width: '30%' },
        },
      ],
    },
  ],
}
