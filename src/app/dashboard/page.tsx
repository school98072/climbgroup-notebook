'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { VideoCard } from '@/components/video/video-card'
import { VideoUpload } from '@/components/video/video-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Video,
  TrendingUp,
  Users,
  Clock,
  Play,
  ArrowRight,
  Loader2,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Mock data for demonstration
const mockRecentVideos = [
  {
    id: '1',
    user_id: '1',
    title: 'First V5 send of the day!',
    description: 'Finally stuck this problem after multiple attempts.',
    video_url: '/demo.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-154娶1590888784-a2c5c6b4d0c7?w=640',
    duration: 45,
    route_name: 'The Wave',
    grade: 'V5',
    location: 'Movement Gym',
    privacy: 'public' as const,
    status: 'ready' as const,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    user_id: '1',
    title: 'Working on crimpy routes',
    description: 'Training day focused on finger strength.',
    video_url: '/demo.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-15078娶8784-a2c5c6b4d0c8?w=640',
    duration: 120,
    route_name: 'Edge Master',
    grade: 'V4',
    location: 'Sender City',
    privacy: 'group' as const,
    status: 'ready' as const,
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    user_id: '1',
    title: 'New project -dyno time!',
    description: 'Working on this fun dyno problem.',
    video_url: '/demo.mp4',
    thumbnail_url: null,
    duration: null,
    route_name: null,
    grade: 'V3',
    location: 'Boulderdash',
    privacy: 'private' as const,
    status: 'processing' as const,
    created_at: '2024-01-14T12:00:00Z',
    updated_at: '2024-01-14T12:00:00Z',
  },
]

const mockStats = [
  { label: 'Videos', value: 24, icon: Video, change: '+3 this week' },
  { label: 'Beta Detections', value: 89, icon: TrendingUp, change: '+12 this week' },
  { label: 'Groups', value: 3, icon: Users, change: 'Active members: 45' },
  { label: 'Time Climbing', value: '12h', icon: Clock, change: 'This month' },
]

export default function DashboardPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 lg:pl-72">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.username || 'Climber'}
          </h1>
          <p className="text-muted-foreground">
            Ready to send some problems? Upload a video to get started.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Button
            className="h-auto py-4 flex-col gap-2"
            onClick={() => setShowUpload(!showUpload)}
          >
            <Plus className="h-5 w-5" />
            Upload Video
          </Button>
          <Link href="/groups">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
              <Users className="h-5 w-5" />
              Browse Groups
            </Button>
          </Link>
          <Link href="/progress">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
              <TrendingUp className="h-5 w-5" />
              View Progress
            </Button>
          </Link>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <Card className="mb-8 animate-in">
            <CardHeader>
              <CardTitle>Upload a Climbing Video</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoUpload
                onUploadComplete={(file, url) => {
                  console.log('Uploaded:', file.name, url)
                  setShowUpload(false)
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="recent" className="mb-8">
          <TabsList>
            <TabsTrigger value="recent">Recent Videos</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shared">Shared With Me</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Recent Videos</h2>
              <Link href="/videos">
                <Button variant="ghost" size="sm" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRecentVideos.filter(v => v.status === 'ready').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  profile={profile || undefined}
                  onClick={() => router.push(`/videos/${video.id}`)}
                />
              ))}
            </div>

            {mockRecentVideos.filter(v => v.status === 'ready').length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No videos yet</p>
                <p className="text-sm">Upload your first climbing video to get started!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Processing Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRecentVideos.filter(v => v.status !== 'ready').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  profile={profile || undefined}
                  onClick={() => {}}
                />
              ))}
            </div>

            {mockRecentVideos.filter(v => v.status !== 'ready').length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No videos currently processing</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Shared With Me</h2>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No shared videos</p>
              <p className="text-sm">Videos shared with you by other climbers will appear here</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Suggested Groups */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Suggested Groups</h2>
            <Link href="/groups">
              <Button variant="ghost" size="sm" className="gap-2">
                Browse All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Boulder Squad', members: 234, description: 'Bouldering enthusiasts sharing beta and tips' },
              { name: 'Training Hub', members: 156, description: 'Focused on training and technique improvement' },
              { name: 'Outdoor Addicts', members: 89, description: 'For those who love outdoor climbing adventures' },
            ].map((group) => (
              <Card key={group.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-1">{group.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{group.members} members</span>
                    <Button size="sm" variant="outline">Join</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Beta Detection Showcase */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-0">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Powered by AI Beta Detection</h2>
                <p className="text-muted-foreground mb-4">
                  Our AI automatically identifies climbing moves in your videos, 
                  highlighting hand positions, footwork, and body positioning 
                  to help you analyze and improve your technique.
                </p>
                <Link href="/beta-demo">
                  <Button className="gap-2">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <div className="bg-background/80 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium">Crimp</span>
                    <span className="text-sm text-muted-foreground ml-auto">0:12 - 0:18</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-medium">Cross</span>
                    <span className="text-sm text-muted-foreground ml-auto">0:18 - 0:24</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-medium">Dyno</span>
                    <span className="text-sm text-muted-foreground ml-auto">0:28 - 0:35</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
