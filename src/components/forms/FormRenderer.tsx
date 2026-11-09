'use client'

import { LoaderCircle } from 'lucide-react'
import Script from 'next/script'
import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useRef, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { submitForm } from '@/lib/forms/submitForm'
import { cn } from '@/lib/utils'

export type RenderedField =
  | { type: 'message'; id: string; content: ReactNode }
  | {
      type: 'text' | 'email' | 'phone' | 'textarea' | 'checkbox' | 'select'
      id: string
      name: string
      label: string
      required: boolean
      width?: number | null
      defaultValue?: boolean | null | string
      options?: { label: string; value: string }[]
    }

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const TOKEN_FIELD = 'cf-turnstile-response'
const TRAP_FIELD = 'alamat_situs'

/** Usually invisible; shows a checkbox only when Cloudflare wants a closer look. Writes its token into the form. */
function Turnstile({ siteKey, widgetId }: { siteKey: string; widgetId: React.RefObject<null | string> }) {
  const element = useRef<HTMLDivElement>(null)

  const render = () => {
    if (!window.turnstile || !element.current || widgetId.current) return
    widgetId.current = window.turnstile.render(element.current, {
      sitekey: siteKey,
      appearance: 'interaction-only',
      size: 'flexible',
      theme: 'light',
      language: 'id',
    })
  }

  useEffect(() => {
    render()
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={render} />
      <div ref={element} />
    </>
  )
}

function Control({ field, invalid }: { field: Extract<RenderedField, { name: string }>; invalid: boolean }) {
  const { type, name, id, required, defaultValue, options } = field
  const shared = { id, name, required, 'aria-invalid': invalid || undefined }
  const text = typeof defaultValue === 'string' ? defaultValue : undefined

  switch (type) {
    case 'textarea':
      return <Textarea {...shared} defaultValue={text} rows={5} />
    case 'select':
      return (
        <Select name={name} items={options} defaultValue={text ?? null}>
          <SelectTrigger id={id} aria-invalid={invalid || undefined} className="h-9 w-full">
            <SelectValue placeholder="Pilih salah satu" />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    default:
      return (
        <Input
          {...shared}
          type={type === 'phone' ? 'tel' : type}
          autoComplete={type === 'email' ? 'email' : type === 'phone' ? 'tel' : undefined}
          defaultValue={text}
        />
      )
  }
}

export function FormRenderer({
  formId,
  fields,
  submitLabel,
  confirmation,
  redirectUrl,
  siteKey,
  className,
}: {
  formId: number
  fields: RenderedField[]
  submitLabel: string
  confirmation?: ReactNode
  redirectUrl?: null | string
  siteKey?: string
  className?: string
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<null | string>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()
  const widgetId = useRef<null | string>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values: Record<string, boolean | string> = {}
    for (const field of fields) {
      if (field.type === 'message') continue
      values[field.name] = field.type === 'checkbox' ? data.has(field.name) : String(data.get(field.name) ?? '')
    }
    startTransition(async () => {
      const result = await submitForm({
        formId,
        values,
        token: String(data.get(TOKEN_FIELD) ?? ''),
        trap: String(data.get(TRAP_FIELD) ?? ''),
      })
      if (result.ok) {
        if (redirectUrl) window.location.assign(redirectUrl)
        else setDone(true)
        return
      }
      setErrors(result.errors ?? {})
      setMessage(result.message ?? null)
      // A token works once, so a rejected attempt needs a new one.
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
    })
  }

  if (done) {
    return (
      <div role="status" className={cn('rounded-xl border border-border bg-card p-6.5', className)}>
        {confirmation ?? <p className="text-base">Terima kasih. Pesan Anda telah kami terima.</p>}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn('flex flex-wrap gap-4.5', className)}>
      <input type="text" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px" />
      {fields.map((field) => {
        if (field.type === 'message') {
          return (
            <div key={field.id} className="min-w-0 flex-[1_1_100%]">
              {field.content}
            </div>
          )
        }
        const error = errors[field.name]
        const label = (
          <FieldLabel htmlFor={field.id}>
            {field.label}
            {field.required && (
              <span aria-hidden className="text-seal-700">
                *
              </span>
            )}
          </FieldLabel>
        )
        return (
          <div
            key={field.id}
            className="min-w-0 flex-[1_1_100%] @xl:flex-[1_1_calc(var(--field-width)-1.125rem)]"
            style={{ '--field-width': `${field.width || 100}%` } as CSSProperties}
          >
            {field.type === 'checkbox' ? (
              <Field orientation="horizontal" data-invalid={Boolean(error)}>
                <Checkbox
                  id={field.id}
                  name={field.name}
                  defaultChecked={field.defaultValue === true}
                  aria-invalid={Boolean(error) || undefined}
                />
                {label}
              </Field>
            ) : (
              <Field data-invalid={Boolean(error)}>
                {label}
                <Control field={field} invalid={Boolean(error)} />
              </Field>
            )}
            {error && <FieldError className="mt-1.5">{error}</FieldError>}
          </div>
        )
      })}
      <div className="flex min-w-0 flex-[1_1_100%] flex-col items-start gap-3">
        {siteKey && <Turnstile siteKey={siteKey} widgetId={widgetId} />}
        {message && (
          <p role="alert" className="text-destructive">
            {message}
          </p>
        )}
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
