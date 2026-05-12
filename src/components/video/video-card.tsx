'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatRelativeTime, formatDuration } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Play, Eye, MessageSquare, Bookmark, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/supabase'

type Video = Database['public']['Tables']['videos']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface VideoCardProps {
  video: Video
  profile?: Profile
  showAuthor?: boolean
  showGroupBadge?: boolean
  groupName?: string
  onClick?: () => void
  className?: string
}

export function VideoCard({
  video,
  profile,
  showAuthor = true,
  showGroupBadge = false,
  groupName,
  onClick,
  className
}: VideoCardProps) {
  const isProcessing = video.status === 'processing' || video.status === 'uploading'
  const isReady = video.status === 'ready'

  return (
    <Card
      className={cn(
        'group overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-muted">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100">
            <Play className="h-6 w-6 text-white ml-1" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && isReady && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Status badge */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-sm mt-2">
                {video.status === 'uploading' ? 'Uploading...' : 'Analyzing...'}
              </p>
            </div>
          </div>
        )}

        {/* Grade badge */}
        {video.grade && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              {video.grade}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {showAuthor && profile && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {profile.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {profile.full_name || profile.username}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatRelativeTime(video.created_at)}</span>
          
          <div className="flex items-center gap-3">
            {video.privacy === 'public' && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
              </span>
            )}
            {isReady && (
              <>
                <span className="flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5" />
                  Beta
                </span>
              </>
            )}
          </div>
        </div>

        {showGroupBadge && groupName && (
          <Badge variant="outline" className="mt-2 text-xs">
            {groupName}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
