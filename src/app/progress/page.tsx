'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  Video,
  Target,
  Trophy,
  Calendar,
  BarChart3,
  Loader2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockStats = {
  totalVideos: 24,
  videosThisMonth: 8,
  totalBetas: 89,
  betasThisMonth: 23,
  avgConfidence: 87,
  topGrade: 'V6',
  climbingStreak: 12,
  totalTime: '47h',
}

const mockWeeklyActivity = [
  { day: 'Mon', videos: 2, betas: 5 },
  { day: 'Tue', videos: 0, betas: 0 },
  { day: 'Wed', videos: 1, betas: 3 },
  { day: 'Thu', videos: 3, betas: 8 },
  { day: 'Fri', videos: 1, betas: 4 },
  { day: 'Sat', videos: 4, betas: 12 },
  { day: 'Sun', videos: 2, betas: 6 },
]

const mockGradeProgress = [
  { grade: 'V0', completed: 5, color: 'bg-green-500' },
  { grade: 'V1', completed: 8, color: 'bg-green-500' },
  { grade: 'V2', completed: 12, color: 'bg-green-500' },
  { grade: 'V3', completed: 10, color: 'bg-amber-500' },
  { grade: 'V4', completed: 7, color: 'bg-amber-500' },
  { grade: 'V5', completed: 4, color: 'bg-primary' },
  { grade: 'V6', completed: 2, color: 'bg-primary' },
]

const mockRecentBetas = [
  { move: 'Crimp', count: 45, trend: 'up' as const },
  { move: 'Cross', count: 38, trend: 'up' as const },
  { move: 'Heel Hook', count: 32, trend: 'up' as const },
  { move: 'Toe Hook', count: 28, trend: 'down' as const },
  { move: 'Dyno', count: 15, trend: 'up' as const },
  { move: 'Mantle', count: 12, trend: 'same' as const },
]

const mockAchievements = [
  { id: '1', name: 'First Send', description: 'Uploaded your first video', icon: Trophy, unlocked: true },
  { id: '2', name: 'Beta Master', description: 'Get 50 Beta detections', icon: Target, unlocked: true },
  { id: '3', name: 'Consistent', description: 'Climb for 7 days in a row', icon: Calendar, unlocked: true },
  { id: '4', name: 'V6 Crusher', description: 'Send a V6 problem', icon: Trophy, unlocked: true },
  { id: '5', name: 'Social Butterfly', description: 'Join 3 groups', icon: Trophy, unlocked: false },
  { id: '6', name: 'Century Club', description: 'Get 100 Beta detections', icon: Target, unlocked: false },
]

export default function ProgressPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()

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

  const maxBetas = Math.max(...mockGradeProgress.map(g => g.completed))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 lg:pl-72">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your climbing journey and see how far you have come
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Video className="h-5 w-5 text-muted-foreground" />
                <Badge variant="success" className="text-xs">
                  +{mockStats.videosThisMonth} this month
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{mockStats.totalVideos}</div>
              <p className="text-sm text-muted-foreground">Videos Uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                <Badge variant="success" className="text-xs">
                  +{mockStats.betasThisMonth} this month
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{mockStats.totalBetas}</div>
              <p className="text-sm text-muted-foreground">Beta Detections</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-green-500">+2 grades</span>
              </div>
              <div className="text-3xl font-bold mb-1">{mockStats.topGrade}</div>
              <p className="text-sm text-muted-foreground">Highest Grade</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-1">{mockStats.avgConfidence}%</div>
              <p className="text-sm text-muted-foreground">Avg. Beta Accuracy</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="grades">Grade Progress</TabsTrigger>
            <TabsTrigger value="beta">Beta Analysis</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-40">
                    {mockWeeklyActivity.map((day) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col gap-1 h-32 justify-end">
                          <div
                            className="bg-primary/20 rounded-t w-full"
                            style={{ height: `${(day.videos / Math.max(...mockWeeklyActivity.map(d => d.videos), 1)) * 100}%` }}
                          />
                          <div
                            className="bg-primary rounded-t w-full"
                            style={{ height: `${(day.betas / Math.max(...mockWeeklyActivity.map(d => d.betas), 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary" />
                      <span className="text-xs text-muted-foreground">Beta Detections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary/20" />
                      <span className="text-xs text-muted-foreground">Videos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>Climbing Streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{mockStats.climbingStreak} days</span>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      <span>Total Time Climbing</span>
                    </div>
                    <span className="font-bold">{mockStats.totalTime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-green-500" />
                      <span>Sends This Week</span>
                    </div>
                    <span className="font-bold">7</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                      <span>Avg. Session Length</span>
                    </div>
                    <span className="font-bold">2.5h</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Problems Completed by Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGradeProgress.map((grade) => (
                    <div key={grade.grade} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{grade.grade}</span>
                        <span className="text-muted-foreground">{grade.completed} problems</span>
                      </div>
                      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${grade.color}`}
                          style={{ width: `${(grade.completed / maxBetas) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beta" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Beta Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentBetas.map((beta, index) => (
                    <div key={beta.move} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1 font-medium">{beta.move}</span>
                      <span className="text-muted-foreground">{beta.count}x</span>
                      <div className="w-16">
                        {beta.trend === 'up' && <ArrowUp className="h-4 w-4 text-green-500" />}
                        {beta.trend === 'down' && <ArrowDown className="h-4 w-4 text-red-500" />}
                        {beta.trend === 'same' && <Minus className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border text-center ${
                        achievement.unlocked
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-muted/50 opacity-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                        achievement.unlocked ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <achievement.icon className={`h-6 w-6 ${
                          achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <h4 className="font-medium mb-1">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <Badge variant="success" className="mt-2 text-xs">Unlocked</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
