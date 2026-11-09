import { RichText } from '@/components/RichText'
import { GENERAL_UNIT } from '@/lib/forms/constants'
import { turnstileSiteKey } from '@/lib/forms/turnstile'
import { pagePath } from '@/lib/preview'
import { getUnits } from '@/lib/queries'
import type { Form, Page } from '@/payload-types'

import { FormRenderer, type RenderedField } from './FormRenderer'

const redirectTarget = (form: Form) => {
  if (form.confirmationType !== 'redirect') return null
  const { type, reference, url } = form.redirect ?? {}
  if (type === 'reference') return typeof reference?.value === 'object' ? pagePath(reference.value as Page) : null
  return url ?? null
}

/** Turns a Form Builder form into what the client form needs, rendering its rich text on the server. */
export async function CmsForm({ form, className }: { form: Form; className?: string }) {
  const fields = await Promise.all(
    (form.fields ?? []).map(async (field, i): Promise<RenderedField> => {
      const id = `form-${form.id}-${field.id ?? i}`
      if (field.blockType === 'message') {
        return { type: 'message', id, content: <RichText data={field.message} /> }
      }
      const base = { id, name: field.name, label: field.label || field.name, width: field.width }
      switch (field.blockType) {
        case 'unit':
          return {
            ...base,
            type: 'select',
            required: true,
            defaultValue: GENERAL_UNIT.value,
            options: [
              GENERAL_UNIT,
              ...(await getUnits({})).map((unit) => ({ label: unit.name, value: String(unit.id) })),
            ],
          }
        case 'select':
          return {
            ...base,
            type: 'select',
            required: Boolean(field.required),
            defaultValue: field.defaultValue,
            options: (field.options ?? []).map(({ label, value }) => ({ label, value })),
          }
        case 'phone':
          return { ...base, type: 'phone', required: Boolean(field.required) }
        default:
          return {
            ...base,
            type: field.blockType,
            required: Boolean(field.required),
            defaultValue: 'defaultValue' in field ? field.defaultValue : undefined,
          }
      }
    }),
  )

  return (
    <FormRenderer
      formId={form.id}
      fields={fields}
      submitLabel={form.submitButtonLabel || 'Kirim'}
      confirmation={form.confirmationType === 'message' ? <RichText data={form.confirmationMessage} /> : undefined}
      redirectUrl={redirectTarget(form)}
      siteKey={turnstileSiteKey()}
      className={className}
    />
  )
}
