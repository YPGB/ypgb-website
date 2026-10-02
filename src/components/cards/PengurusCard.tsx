'use client'

import { UserRound } from 'lucide-react'

import { Media } from '@/components/Media'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { personName } from '@/lib/format'
import type { Pengurus } from '@/payload-types'

function Avatar({ member, size }: { member: Pengurus; size: string }) {
  return (
    <div className={`relative ${size} shrink-0 overflow-hidden rounded-full bg-muted`}>
      {typeof member.photo === 'object' && member.photo?.url ? (
        <Media media={member.photo} sizes="128px" />
      ) : (
        <UserRound className="absolute inset-0 m-auto size-1/2 text-umber-400" aria-hidden />
      )}
    </div>
  )
}

export function PengurusCard({ member }: { member: Pengurus }) {
  const name = personName(member)
  const body = (
    <Card className="h-full items-center gap-3 px-4.5 py-6.5 text-center">
      <Avatar member={member} size="size-24" />
      <div className="flex flex-col gap-1">
        <p className="font-heading text-base font-semibold leading-snug">{name}</p>
        <p className="text-muted-foreground">{member.position}</p>
        {member.term && <p className="text-xs text-muted-foreground">{member.term}</p>}
      </div>
    </Card>
  )

  if (!member.bio) return body

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="h-full rounded-xl text-left transition-[box-shadow,translate] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-md"
          />
        }
      >
        {body}
      </DialogTrigger>
      <DialogContent className="max-w-[520px]">
        <DialogHeader className="flex-row items-center gap-4 text-left">
          <Avatar member={member} size="size-16" />
          <div>
            <DialogTitle className="font-heading text-h3">{name}</DialogTitle>
            <DialogDescription>
              {member.position}
              {member.term ? ` · ${member.term}` : ''}
            </DialogDescription>
          </div>
        </DialogHeader>
        <p className="whitespace-pre-line leading-relaxed">{member.bio}</p>
      </DialogContent>
    </Dialog>
  )
}
