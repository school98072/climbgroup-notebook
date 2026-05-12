import Link from 'next/link'
import { Mountain, ArrowRight, Video, Users, Zap, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Mountain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ClimbGroup</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Beta Detection powered by AI
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Digital Training Ground
            <br />
            <span className="text-primary">For Modern Climbers</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your climbing sessions, get automated Beta detection, share with your crew,
            and track your progress—all in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Level Up
            </h2>
            <p className="text-lg text-muted-foreground">
              From first attempts to perfect sends, ClimbGroup Notebook has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Video Upload & Playback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Upload climbing session videos from any device. Cloud storage with
                  fast playback and in-video controls.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Automated Beta Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI-powered analysis identifies climbing moves and overlays Beta
                  paths directly on your videos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Community Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Create or join climbing groups. Share videos, give feedback,
                  and learn from fellow climbers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Dashboard tracks your videos, Beta insights, and climbing
                  journey over time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Annotations & Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Add time-stamped notes to videos. Coaches can overlay feedback,
                  and group members can comment on specific moments.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
          </div>

          <div className="space-y-12">
            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Session</h3>
                <p className="text-muted-foreground">
                  Drag and drop your climbing videos or record directly. We support MP4, WebM, and MOV formats up to 500MB.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Beta Detection Runs</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your video and identifies key climbing moves, displaying them as overlays on the timeline.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Share & Get Feedback</h3>
                <p className="text-muted-foreground">
                  Share to your groups, add annotations, and get feedback from coaches and fellow climbers.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-muted-foreground">
                  Watch your skills improve over time with your personal dashboard and progress analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Level Up Your Climbing?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of climbers using ClimbGroup Notebook to improve their technique.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Mountain className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">ClimbGroup Notebook</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Built for climbers, by climbers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
