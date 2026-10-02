import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const isAdminUser = (user: unknown): boolean => (user as User | null)?.role === 'admin'

export const isStaffUser = (user: unknown): boolean => {
  const role = (user as User | null)?.role
  return role === 'admin' || role === 'editor'
}

export const anyone: Access = () => true

export const admin: Access = ({ req: { user } }) => isAdminUser(user)

export const staff: Access = ({ req: { user } }) => isStaffUser(user)

export const adminField: FieldAccess = ({ req: { user } }) => isAdminUser(user)

/** Staff see drafts; the public only sees published documents. */
export const publishedOrStaff: Access = ({ req: { user } }) =>
  isStaffUser(user) ? true : { _status: { equals: 'published' } }

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (isAdminUser(user)) return true
  return user ? { id: { equals: user.id } } : false
}
