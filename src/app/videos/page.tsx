'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { VideoUpload } from '@/components/video/video-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { VideoCard } from '@/components/video/video-card'
import {
  Search,
  Filter,
  Grid,
  List,
  Upload,
  Loader2,
  Video
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockVideos = [
  {
    id: '1',
    user_id: '1',
    title: 'V6 Flash! Finally got it',
    description: 'After weeks of working this problem, finally flashed it on the first try today!',
    video_url: '/demo.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=640',
    duration: 52,
    route_name: 'Purple Reign',
    grade: 'V6',
    location: 'Brooklyn Boulders',
    privacy: 'public' as const,
    status: 'ready' as const,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    user_id: '1',
    title: 'Training: Crimp strength work',
    description: 'Focused session on improving my crimp strength.',
    video_url: '/demo.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640',
    duration: 180,
    route_name: null,
    grade: null,
    location: 'Home Wall',
    privacy: 'private' as const,
    status: 'ready' as const,
    created_at: '2024-01-14T18:00:00Z',
    updated_at: '2024-01-14T18:00:00Z',
  },
  {
    id: '3',
    user_id: '1',
    title: 'Outdoor adventure day',
    description: 'Amazing day at the local crag. Perfect weather!',
    video_url: '/demo.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=640',
    duration: 320,
    route_name: 'Sunset Slab',
    grade: '5.10b',
    location: 'Red Rocks',
    privacy: 'public' as const,
    status: 'ready' as const,
    created_at: '2024-01-12T14:00:00Z',
    updated_at: '2024-01-12T14:00:00Z',
  },
]

export default function VideosPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterPrivacy, setFilterPrivacy] = useState<string>('all')

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

  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.route_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.grade?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterPrivacy === 'all') return matchesSearch
    return matchesSearch && video.privacy === filterPrivacy
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 lg:pl-72">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Videos</h1>
            <p className="text-muted-foreground">
              Manage and analyze your climbing videos
            </p>
          </div>
          <Link href="/upload">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Video
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, route, or grade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterPrivacy}
                  onChange={(e) => setFilterPrivacy(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">All Privacy</option>
                  <option value="public">Public</option>
                  <option value="group">Group</option>
                  <option value="private">Private</option>
                </select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-secondary' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-secondary' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredVideos.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    profile={profile || undefined}
                    onClick={() => router.push(`/videos/${video.id}`)}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No videos found</p>
                <p className="text-sm mb-4">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Upload your first video to get started'}
                </p>
                {!searchQuery && (
                  <Link href="/upload">
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Video
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos currently processing</p>
            </div>
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos shared with you</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
