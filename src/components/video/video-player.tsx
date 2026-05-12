'use client'

import { useState, useRef, useEffect } from 'react'
import { cn, formatDuration } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MessageSquare,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface BetaDetection {
  id: string
  move_type: string
  start_time: number
  end_time: number
  confidence: number
  description?: string
}

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  betaDetections?: BetaDetection[]
  onTimeUpdate?: (time: number) => void
  onAnnotationClick?: (timestamp: number) => void
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  title,
  betaDetections = [],
  onTimeUpdate,
  onAnnotationClick,
  className
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showBetaOverlay, setShowBetaOverlay] = useState(true)
  const [activeBeta, setActiveBeta] = useState<BetaDetection | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const hideControlsTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime)
      
      // Check for active beta detection
      const active = betaDetections.find(
        beta => video.currentTime >= beta.start_time && video.currentTime <= beta.end_time
      )
      setActiveBeta(active || null)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [betaDetections, onTimeUpdate])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleSeek = (delta: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + delta))
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current)
    }
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const getBetaColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500'
    if (confidence >= 0.7) return 'bg-amber-500'
    return 'bg-climb-orange'
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
      />

      {/* Beta Detection Overlay */}
      {showBetaOverlay && activeBeta && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', getBetaColor(activeBeta.confidence))} />
              <span className="font-medium">{activeBeta.move_type}</span>
            </div>
            {activeBeta.description && (
              <p className="text-xs text-white/70 mt-1">{activeBeta.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="h-8 w-8 text-white ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-16 pb-4 px-4 transition-opacity',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Beta Timeline */}
        {betaDetections.length > 0 && (
          <div className="mb-2 h-8 relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6">
              {betaDetections.map((beta) => {
                const startPercent = (beta.start_time / duration) * 100
                const width = ((beta.end_time - beta.start_time) / duration) * 100
                return (
                  <div
                    key={beta.id}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-3 rounded-full cursor-pointer transition-transform hover:scale-y-150',
                      getBetaColor(beta.confidence)
                    )}
                    style={{ left: `${startPercent}%`, width: `${width}%` }}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = beta.start_time
                      }
                    }}
                    title={`${beta.move_type} (${Math.round(beta.confidence * 100)}%)`}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="relative h-1 bg-white/30 rounded-full mb-4 cursor-pointer group/bar">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => handleSeek(-10)}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => handleSeek(10)}
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-primary"
              />
            </div>

            <span className="text-white text-sm ml-2">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'text-white hover:bg-white/20',
                showBetaOverlay && 'bg-white/20'
              )}
              onClick={() => setShowBetaOverlay(!showBetaOverlay)}
              title="Toggle Beta Detection"
            >
              <Bookmark className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title="Add Annotation"
              onClick={() => onAnnotationClick?.(currentTime)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Beta Detection Panel */}
      {showBetaOverlay && betaDetections.length > 0 && (
        <div className="absolute right-0 top-0 bottom-16 w-64 bg-black/80 backdrop-blur p-4 transform translate-x-full group-hover:translate-x-0 transition-transform overflow-y-auto">
          <h4 className="text-white font-medium mb-3">Beta Detections</h4>
          <div className="space-y-2">
            {betaDetections.map((beta) => (
              <button
                key={beta.id}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = beta.start_time
                  }
                }}
                className={cn(
                  'w-full text-left p-2 rounded-lg transition-colors',
                  activeBeta?.id === beta.id
                    ? 'bg-primary/30'
                    : 'bg-white/10 hover:bg-white/20'
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', getBetaColor(beta.confidence))} />
                  <span className="text-white text-sm font-medium">{beta.move_type}</span>
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {formatDuration(beta.start_time)} - {formatDuration(beta.end_time)}
                </div>
                <div className="text-white/40 text-xs">
                  {Math.round(beta.confidence * 100)}% confidence
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
