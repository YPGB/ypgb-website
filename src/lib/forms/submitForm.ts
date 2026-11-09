'use server'

import { getPayloadClient, getUnits } from '@/lib/queries'
import type { Form } from '@/payload-types'

import { GENERAL_UNIT } from './constants'
import { verifyTurnstile } from './turnstile'

export type SubmitInput = {
  formId: number
  values: Record<string, boolean | string>
  token: string
  /** Hidden from people; anything in it means a bot filled in the form. */
  trap: string
}

export type SubmitResult = { ok: true } | { ok: false; message?: string; errors?: Record<string, string> }

const MAX_LENGTH = 5000
const REQUIRED = 'Kolom ini wajib diisi.'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormField = NonNullable<Form['fields']>[number]

/** Checks the values against the form's own fields; anything else that was sent is dropped. */
const validate = async (fields: FormField[], values: SubmitInput['values']) => {
  const errors: Record<string, string> = {}
  const submissionData: { field: string; value: string }[] = []
  let unit: null | number = null

  for (const field of fields) {
    if (field.blockType === 'message') continue
    const raw = values[field.name]

    if (field.blockType === 'checkbox') {
      if (field.required && raw !== true) errors[field.name] = REQUIRED
      submissionData.push({ field: field.name, value: raw === true ? 'Ya' : 'Tidak' })
      continue
    }

    const value = typeof raw === 'string' ? raw.trim() : ''

    if (field.blockType === 'unit') {
      const units = await getUnits({})
      const chosen = units.find((u) => String(u.id) === value)
      if (value !== GENERAL_UNIT.value && !chosen) errors[field.name] = REQUIRED
      unit = chosen?.id ?? null
      submissionData.push({ field: field.name, value: chosen?.name ?? GENERAL_UNIT.label })
      continue
    }

    if (!value) {
      if (field.required) errors[field.name] = REQUIRED
      continue
    }
    if (value.length > MAX_LENGTH) errors[field.name] = `Maksimal ${MAX_LENGTH} karakter.`
    if (field.blockType === 'email' && !EMAIL.test(value)) errors[field.name] = 'Alamat email tidak valid.'
    if (field.blockType === 'select' && !field.options?.some((option) => option.value === value)) {
      errors[field.name] = 'Pilihan tidak valid.'
    }
    submissionData.push({ field: field.name, value })
  }

  return { errors, submissionData, unit }
}

export async function submitForm({ formId, values, token, trap }: SubmitInput): Promise<SubmitResult> {
  // Looks like a success, so bots don't learn to avoid the trap.
  if (trap) return { ok: true }

  if (!(await verifyTurnstile(token))) {
    return { ok: false, message: 'Verifikasi keamanan belum selesai. Mohon tunggu sebentar, lalu kirim kembali.' }
  }

  try {
    const payload = await getPayloadClient()
    const form = await payload.findByID({ collection: 'forms', id: formId, depth: 0 })
    const { errors, submissionData, unit } = await validate(form.fields ?? [], values)
    if (Object.keys(errors).length) return { ok: false, errors }

    await payload.create({ collection: 'form-submissions', data: { form: form.id, submissionData, unit } })
    return { ok: true }
  } catch (error) {
    console.error('Form submission failed', error)
    return { ok: false, message: 'Pesan tidak dapat dikirim. Mohon coba beberapa saat lagi.' }
  }
}
