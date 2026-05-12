'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { VideoCard } from '@/components/video/video-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Settings,
  Users,
  Video,
  MessageSquare,
  UserPlus,
  Search,
  Loader2,
  Lock,
  Globe,
  Share2,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime, cn } from '@/lib/utils'

// Mock data
const mockGroup = {
  id: '1',
  name: 'Boulder Squad NYC',
  description: 'A community for boulderers in the NYC area. Share beta, organize sessions, and celebrate sends together. We meet at Brooklyn Boulders every Tuesday and Sunday for group sessions.',
  avatar_url: null,
  privacy: 'public' as const,
  created_by: '1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockMembers = [
  { id: '1', username: 'climber_jane', full_name: 'Jane Smith', avatar_url: null, role: 'admin' as const },
  { id: '2', username: 'send_it', full_name: 'Alex Chen', avatar_url: null, role: 'moderator' as const },
  { id: '3', username: 'rock_hound', full_name: 'Jordan Lee', avatar_url: null, role: 'member' as const },
  { id: '4', username: 'crag_life', full_name: 'Sam Wilson', avatar_url: null, role: 'member' as const },
]

const mockFeed = [
  {
    id: '1',
    user_id: '2',
    type: 'video' as const,
    content: 'Finally flashed this V5 today! The heel hook beta was key.',
    video: {
      id: '1',
      title: 'V5 Flash - The Wave',
      thumbnail_url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=640',
      grade: 'V5',
    },
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    user_id: '3',
    type: 'text' as const,
    content: 'Who wants to join for a session this Saturday at Brooklyn Boulders? Looking to work on some V6s and V7s. DM me if interested!',
    created_at: '2024-01-14T18:00:00Z',
  },
  {
    id: '3',
    user_id: '4',
    type: 'video' as const,
    content: 'Working on this tricky mantle. Any tips?',
    video: {
      id: '2',
      title: 'Mantle Practice',
      thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640',
      grade: 'V4',
    },
    created_at: '2024-01-14T14:00:00Z',
  },
]

export default function GroupDetailPage() {
  const { user, profile, isLoading } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [newPost, setNewPost] = useState('')
  const [isMember] = useState(true)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 lg:pl-72">
        <div className="mb-6">
          <Link href="/groups">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Groups
            </Button>
          </Link>
        </div>

        {/* Group Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground/30" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      {mockGroup.name}
                      <Badge variant={mockGroup.privacy === 'public' ? 'secondary' : 'outline'}>
                        {mockGroup.privacy === 'public' ? (
                          <Globe className="h-3 w-3 mr-1" />
                        ) : (
                          <Lock className="h-3 w-3 mr-1" />
                        )}
                        {mockGroup.privacy}
                      </Badge>
                    </h1>
                    <p className="text-muted-foreground">{mockMembers.length} members</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Notify
                    </Button>
                    {isMember ? (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    ) : (
                      <Button size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{mockGroup.description}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Created {formatRelativeTime(mockGroup.created_at)}</span>
                  <span>by {mockMembers.find(m => m.id === mockGroup.created_by)?.full_name}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            {isMember && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {profile?.username?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Share something with the group..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Post</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feed */}
            <div className="space-y-4">
              {mockFeed.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>
                          {post.user_id === '2' ? 'AC' : post.user_id === '3' ? 'JL' : 'SW'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {post.user_id === '2' ? 'Alex Chen' : post.user_id === '3' ? 'Jordan Lee' : 'Sam Wilson'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(post.created_at)}
                        </p>
                      </div>
                    </div>

                    <p className="mb-4">{post.content}</p>

                    {post.type === 'video' && post.video && (
                      <div className="rounded-lg overflow-hidden border bg-muted/50 cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="aspect-video relative">
                          <img
                            src={post.video.thumbnail_url}
                            alt={post.video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary">{post.video.grade}</Badge>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-medium">{post.video.title}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {member.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {member.full_name || member.username}
                        </p>
                        {member.role !== 'member' && (
                          <Badge variant="secondary" className="text-xs">
                            {member.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {mockMembers.length > 4 && (
                  <Button variant="ghost" className="w-full mt-4">
                    View all {mockMembers.length} members
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Share2 className="h-4 w-4" />
                    Invite Members
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Video className="h-4 w-4" />
                    View Group Videos
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Group Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
