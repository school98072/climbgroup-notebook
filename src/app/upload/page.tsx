'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { VideoUpload } from '@/components/video/video-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, MapPin, Tag } from 'lucide-react'
import Link from 'next/link'

const grades = [
  'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12',
  '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d',
]

export default function UploadPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [routeName, setRouteName] = useState('')
  const [grade, setGrade] = useState('')
  const [location, setLocation] = useState('')
  const [privacy, setPrivacy] = useState<'private' | 'group' | 'public'>('private')
  const [uploadedFile, setUploadedFile] = useState<{ file: File; url: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleUploadComplete = (file: File, url: string) => {
    setUploadedFile({ file, url })
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
    }
  }

  const handleSubmit = async () => {
    if (!uploadedFile || !title) return
    
    setIsSubmitting(true)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push('/videos')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 lg:pl-72 max-w-4xl">
        <div className="mb-6">
          <Link href="/videos">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Videos
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
          <p className="text-muted-foreground">
            Share your climbing session with the community
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Video File</CardTitle>
              <CardDescription>
                Upload your climbing video (MP4, WebM, MOV up to 500MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <VideoUpload onUploadComplete={handleUploadComplete} maxFiles={1} />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
                    <video
                      src={uploadedFile.url}
                      className="w-32 h-20 object-cover rounded"
                      controls
                      muted
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadedFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge variant="success">Ready</Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setUploadedFile(null)}
                  >
                    Replace Video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </label>
                  <Input
                    id="title"
                    placeholder="Give your video a descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Share notes about this climbing session..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="routeName" className="text-sm font-medium">
                      <Tag className="h-4 w-4 inline mr-1" />
                      Route Name
                    </label>
                    <Input
                      id="routeName"
                      placeholder="Name of the problem/route"
                      value={routeName}
                      onChange={(e) => setRouteName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="grade" className="text-sm font-medium">
                      Grade
                    </label>
                    <select
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select grade</option>
                      <optgroup label="Bouldering">
                        {grades.filter(g => g.startsWith('V')).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Sport">
                        {grades.filter(g => g.startsWith('5.')).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </label>
                  <Input
                    id="location"
                    placeholder="Gym name or outdoor location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Choose who can see your video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={privacy === 'private'}
                      onChange={(e) => setPrivacy(e.target.value as typeof privacy)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Private</p>
                      <p className="text-sm text-muted-foreground">
                        Only you can see this video
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="privacy"
                      value="group"
                      checked={privacy === 'group'}
                      onChange={(e) => setPrivacy(e.target.value as typeof privacy)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Group</p>
                      <p className="text-sm text-muted-foreground">
                        Share with specific climbing groups
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={privacy === 'public'}
                      onChange={(e) => setPrivacy(e.target.value as typeof privacy)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Public</p>
                      <p className="text-sm text-muted-foreground">
                        Anyone can see and discover this video
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              disabled={!uploadedFile || !title || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Upload & Analyze'
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
