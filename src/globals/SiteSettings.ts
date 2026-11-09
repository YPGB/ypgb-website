import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { admin, anyone } from '@/access'

export const SITE_SETTINGS_TAG = 'site-settings'

const imageOnly = { mimeType: { contains: 'image' } }

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: admin,
  },
  hooks: {
    afterChange: [
      ({ req: { context } }) => {
        if (!context.disableRevalidate) revalidateTag(SITE_SETTINGS_TAG, { expire: 0 })
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              defaultValue: 'Yayasan Pendidikan Gembala Baik',
              admin: { description: 'Full official name. Used in page titles and the footer.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'kicker',
                  type: 'text',
                  defaultValue: 'Yayasan Pendidikan',
                  admin: { description: 'Small line above the wordmark.', width: '33%' },
                },
                {
                  name: 'wordmark',
                  type: 'text',
                  required: true,
                  defaultValue: 'Gembala Baik',
                  admin: { description: 'Short name shown next to the logo.', width: '33%' },
                },
                {
                  name: 'place',
                  type: 'text',
                  defaultValue: 'Pontianak',
                  admin: { description: 'Optional line under the wordmark.', width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: imageOnly,
                  admin: {
                    description: 'Main logo, for light backgrounds. Falls back to the built-in seal.',
                    width: '50%',
                  },
                },
                {
                  name: 'logoOnDark',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: imageOnly,
                  admin: {
                    description: 'Optional variant for dark backgrounds (header/footer).',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              filterOptions: imageOnly,
              admin: { description: 'Square PNG or SVG, at least 512×512.' },
            },
          ],
        },
        {
          label: 'Profile',
          fields: [
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'One or two sentences about the foundation. Used for search engines and the footer.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'motto',
                  type: 'text',
                  defaultValue: 'Sub Cura Pastoris Boni Crescimus',
                  admin: { width: '70%' },
                },
                {
                  name: 'foundedYear',
                  type: 'number',
                  min: 1900,
                  max: 2100,
                  admin: { width: '30%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'address', type: 'textarea' },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Map URL',
              admin: { description: 'Google Maps link to the address.' },
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              label: 'Map embed',
              admin: {
                description: 'Shown in the footer. In Google Maps: Share > Embed a map > Copy HTML, then paste it here.',
              },
              hooks: {
                // Keeps only the address from the pasted <iframe ...> code.
                beforeValidate: [({ value }) => (typeof value === 'string' ? (value.match(/src="([^"]+)"/)?.[1] ?? value).trim() : value)],
              },
              validate: (value: null | string | undefined) =>
                !value || value.startsWith('https://www.google.com/maps/embed') || 'Paste the code from Share > Embed a map in Google Maps.',
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { width: '50%' } },
                {
                  name: 'whatsapp',
                  type: 'text',
                  admin: { description: 'Number in international format, e.g. 6281234567890.', width: '50%' },
                },
              ],
            },
            {
              name: 'phones',
              type: 'array',
              labels: { singular: 'Phone', plural: 'Phones' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      admin: { placeholder: 'Sekretariat', width: '40%' },
                    },
                    {
                      name: 'number',
                      type: 'text',
                      required: true,
                      admin: { placeholder: '(0561) 700-000', width: '60%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'officeHours',
              type: 'array',
              labels: { singular: 'Office hours', plural: 'Office hours' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'days',
                      type: 'text',
                      required: true,
                      admin: { placeholder: 'Senin – Jumat', width: '50%' },
                    },
                    {
                      name: 'hours',
                      type: 'text',
                      required: true,
                      admin: { placeholder: '07.00 – 15.00 WIB', width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'socials',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: ['instagram', 'facebook', 'youtube', 'tiktok', 'x', 'linkedin'].map((v) => ({
                        label: v === 'x' ? 'X' : v[0].toUpperCase() + v.slice(1),
                        value: v,
                      })),
                      admin: { width: '30%' },
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
