import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { isStaffUser } from '@/access'
import { getPayloadClient } from '@/lib/queries'

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/'
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Invalid path', { status: 400 })
  }
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!isStaffUser(user)) {
    return new Response('You must be logged in to preview', { status: 403 })
  }
  ;(await draftMode()).enable()
  redirect(path)
}
