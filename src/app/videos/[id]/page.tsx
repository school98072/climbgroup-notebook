'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { VideoPlayer } from '@/components/video/video-player'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Edit,
  Share2,
  Trash2,
  MessageSquare,
  Bookmark,
  MapPin,
  Clock,
  Eye,
  Download,
  Loader2,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { formatDuration, formatRelativeTime, cn } from '@/lib/utils'

// Mock data
const mockVideo = {
  id: '1',
  user_id: '1',
  title: 'V6 Flash! Finally got it after weeks of attempts',
  description: 'This has been my project for the past 3 weeks. Today was the day! The key was adjusting my beta on the second move - instead of the classic cross, I went with a matched hand position that made the reach much more manageable. The dyno at the end is the crux but once you commit, it clicks into place perfectly.',
  video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  thumbnail_url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1280',
  duration: 52,
  route_name: 'Purple Reign',
  grade: 'V6',
  location: 'Brooklyn Boulders',
  privacy: 'public' as const,
  status: 'ready' as const,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
}

const mockBetaDetections = [
  { id: '1', move_type: 'Crimp', confidence: 0.95, start_time: 8, end_time: 15, description: 'Small edge hold' },
  { id: '2', move_type: 'Cross', confidence: 0.88, start_time: 15, end_time: 22, description: 'Left hand cross to opposite side' },
  { id: '3', move_type: 'Heel Hook', confidence: 0.92, start_time: 22, end_time: 30, description: 'Left heel hooked for stability' },
  { id: '4', move_type: 'Toe Hook', confidence: 0.85, start_time: 30, end_time: 38, description: 'Right toe hooked for position' },
  { id: '5', move_type: 'Dyno', confidence: 0.78, start_time: 38, end_time: 45, description: 'Dynamic movement to top' },
]

const mockAnnotations = [
  { id: '1', timestamp: 8, content: 'Focus on thumb placement for better grip', type: 'note' as const },
  { id: '2', timestamp: 22, content: 'Try matching here instead of crossing', type: 'feedback' as const },
  { id: '3', timestamp: 38, content: 'This dyno is the crux - commit fully!', type: 'highlight' as const },
]

const mockComments = [
  {
    id: '1',
    user_id: '2',
    content: 'Clean beta! That heel hook adjustment made a huge difference.',
    timestamp: null,
    created_at: '2024-01-15T12:00:00Z',
    profile: { username: 'climber_pro', full_name: 'Alex Chen', avatar_url: null }
  },
  {
    id: '2',
    user_id: '3',
    content: 'Great send! The cross move looked really controlled.',
    timestamp: null,
    created_at: '2024-01-15T11:30:00Z',
    profile: { username: 'send_it', full_name: 'Jordan Lee', avatar_url: null }
  },
]

export default function VideoDetailPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(mockVideo.title)
  const [editedDescription, setEditedDescription] = useState(mockVideo.description)
  const [newComment, setNewComment] = useState('')
  const [showAnnotationForm, setShowAnnotationForm] = useState(false)
  const [annotationTimestamp, setAnnotationTimestamp] = useState<number | null>(null)
  const [annotationContent, setAnnotationContent] = useState('')

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

  const handleAnnotationClick = (timestamp: number) => {
    setAnnotationTimestamp(timestamp)
    setShowAnnotationForm(true)
  }

  const handleAddAnnotation = () => {
    if (!annotationContent || annotationTimestamp === null) return
    setShowAnnotationForm(false)
    setAnnotationContent('')
    setAnnotationTimestamp(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 lg:pl-72">
        <div className="mb-6">
          <Link href="/videos">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Videos
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              src={mockVideo.video_url}
              poster={mockVideo.thumbnail_url || undefined}
              betaDetections={mockBetaDetections}
              onAnnotationClick={handleAnnotationClick}
              className="aspect-video"
            />

            {/* Video Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  {isEditing ? (
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-xl font-bold"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{mockVideo.title}</h1>
                  )}
                  
                  {user.id === mockVideo.user_id && (
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button size="sm" onClick={() => setIsEditing(false)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </>
                      ) : (
                        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="outline">{mockVideo.grade}</Badge>
                  {mockVideo.route_name && (
                    <Badge variant="secondary">{mockVideo.route_name}</Badge>
                  )}
                  {mockVideo.location && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {mockVideo.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDuration(mockVideo.duration)}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {Math.floor(Math.random() * 500)} views
                  </span>
                </div>

                {isEditing ? (
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={4}
                    className="mb-4"
                  />
                ) : (
                  <p className="text-muted-foreground">{mockVideo.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {profile?.username?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile?.full_name || profile?.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatRelativeTime(mockVideo.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Annotation Form */}
            {showAnnotationForm && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">
                      Add Annotation at {annotationTimestamp && formatDuration(annotationTimestamp)}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAnnotationForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a note or feedback..."
                      value={annotationContent}
                      onChange={(e) => setAnnotationContent(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAnnotation()}
                    />
                    <Button onClick={handleAddAnnotation}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({mockComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.profile.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {comment.profile.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {comment.profile.full_name || comment.profile.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Beta Detections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Beta Detections ({mockBetaDetections.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBetaDetections.map((beta) => (
                    <div
                      key={beta.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full',
                          beta.confidence >= 0.9 ? 'bg-green-500' :
                          beta.confidence >= 0.7 ? 'bg-amber-500' : 'bg-primary'
                        )}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{beta.move_type}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(beta.start_time)} - {formatDuration(beta.end_time)}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(beta.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Annotations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  My Annotations ({mockAnnotations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnnotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className="p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant={annotation.type === 'highlight' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {annotation.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(annotation.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{annotation.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Share2 className="h-4 w-4" />
                    Share to Group
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Download Video
                  </Button>
                  {user.id === mockVideo.user_id && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Video
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
