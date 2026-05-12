'use client'

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Lock, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/supabase'

type Group = Database['public']['Tables']['groups']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface GroupCardProps {
  group: Group
  creator?: Profile
  memberCount?: number
  isMember?: boolean
  onJoin?: () => void
  onLeave?: () => void
  className?: string
}

export function GroupCard({
  group,
  creator,
  memberCount = 0,
  isMember = false,
  onJoin,
  onLeave,
  className
}: GroupCardProps) {
  const privacyIcon = {
    public: Users,
    private: Lock,
    invite: Lock
  }[group.privacy]

  const privacyLabel = {
    public: 'Public',
    private: 'Private',
    invite: 'Invite Only'
  }[group.privacy]

  return (
    <Card className={cn('group overflow-hidden hover:shadow-lg transition-all', className)}>
      <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20 relative">
        {group.avatar_url ? (
          <img
            src={group.avatar_url}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/groups/${group.id}`}>
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {group.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                <privacyIcon className="h-3 w-3 mr-1" />
                {privacyLabel}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {group.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {group.description}
          </p>
        )}

        {creator && (
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-5 w-5">
              <AvatarImage src={creator.avatar_url || undefined} />
              <AvatarFallback className="text-[10px]">
                {creator.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Created by {creator.full_name || creator.username}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(group.created_at)}
          </span>

          {onJoin && !isMember && group.privacy === 'public' && (
            <Button size="sm" onClick={onJoin} className="gap-1">
              <UserPlus className="h-4 w-4" />
              Join
            </Button>
          )}

          {onLeave && isMember && (
            <Button size="sm" variant="outline" onClick={onLeave} className="text-xs">
              Leave
            </Button>
          )}

          {isMember && (
            <Badge variant="secondary" className="text-xs">
              Member
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
