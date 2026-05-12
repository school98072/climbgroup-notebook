'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mountain, Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const climbingStyles = [
  { id: 'bouldering', label: 'Bouldering', description: 'Short, powerful problems with crash pads' },
  { id: 'sport', label: 'Sport Climbing', description: 'Bolt-protected routes with quickdraws' },
  { id: 'both', label: 'Both', description: 'I enjoy all types of climbing' },
]

const experienceLevels = [
  { id: 'beginner', label: 'Beginner', description: 'Just started climbing' },
  { id: 'intermediate', label: 'Intermediate', description: 'V4+/6A+ and up' },
  { id: 'advanced', label: 'Advanced', description: 'V7+/7A and up' },
  { id: 'expert', label: 'Expert', description: 'V9+/7C+ and up' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [climbingStyle, setClimbingStyle] = useState<string>('')
  const [experienceLevel, setExperienceLevel] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { profile } = useAuth()
  const router = useRouter()

  const handleComplete = async () => {
    setIsLoading(true)
    
    // In production, this would update the profile in Supabase
    // For now, just redirect to dashboard
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/dashboard')
  }

  const canProceed = () => {
    if (step === 1) return !!climbingStyle
    if (step === 2) return !!experienceLevel
    return true
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Mountain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">ClimbGroup</span>
          </Link>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s <= step ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Step {step} of 3
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {step === 1 && "What's your climbing style?"}
              {step === 2 && "What's your experience level?"}
              {step === 3 && "You're all set!"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Help us personalize your experience"}
              {step === 2 && "This helps us recommend relevant content"}
              {step === 3 && "Your profile is ready to go"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-3">
                {climbingStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setClimbingStyle(style.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      climbingStyle === style.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{style.label}</h4>
                        <p className="text-sm text-muted-foreground">{style.description}</p>
                      </div>
                      {climbingStyle === style.id && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceLevel(level.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      experienceLevel === level.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{level.label}</h4>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      {experienceLevel === level.id && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome to ClimbGroup!</h3>
                <p className="text-muted-foreground mb-6">
                  {profile?.username || 'Climber'}, you&apos;re ready to start your climbing journey.
                  Upload your first video and let&apos;s detect some Beta!
                </p>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h4 className="font-medium mb-2">What you can do next:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Upload a climbing session video
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Join or create a climbing group
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Explore public videos and get inspired
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Go to Dashboard
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary hover:underline"
          >
            Skip for now
          </button>
        </p>
      </div>
    </div>
  )
}
