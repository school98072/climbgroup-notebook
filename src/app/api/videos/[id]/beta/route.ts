import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This would be your actual Beta detection service integration
// For demo purposes, we simulate the detection

interface BetaDetectionResult {
  move_type: string
  confidence: number
  start_time: number
  end_time: number
  description?: string
}

// Simulated beta detection (in production, this would call an ML service)
function simulateBetaDetection(videoUrl: string): BetaDetectionResult[] {
  // This is a placeholder for actual ML-based detection
  // In production, you would:
  // 1. Download the video or access it via URL
  // 2. Send it to your ML model or partner API
  // 3. Parse and return the detected moves

  return [
    {
      move_type: 'Start',
      confidence: 0.95,
      start_time: 0,
      end_time: 3,
      description: 'Starting position'
    },
    {
      move_type: 'Crimp',
      confidence: 0.88,
      start_time: 3,
      end_time: 8,
      description: 'Small edge hold, right hand'
    },
    {
      move_type: 'Cross',
      confidence: 0.82,
      start_time: 8,
      end_time: 14,
      description: 'Left hand cross to opposite side'
    },
    {
      move_type: 'Heel Hook',
      confidence: 0.91,
      start_time: 14,
      end_time: 20,
      description: 'Left heel hooked for stability'
    },
    {
      move_type: 'Toe Hook',
      confidence: 0.85,
      start_time: 20,
      end_time: 26,
      description: 'Right toe hooked for position'
    },
    {
      move_type: 'Gaston',
      confidence: 0.78,
      start_time: 26,
      end_time: 32,
      description: 'Forceful outward push'
    },
    {
      move_type: 'Dyno',
      confidence: 0.72,
      start_time: 32,
      end_time: 40,
      description: 'Dynamic movement to top'
    }
  ]
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Verify video exists and user owns it
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: video } = await supabase
      .from('videos')
      .select('id, video_url, status')
      .eq('id', id)
      .single()

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    if (video.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update status to processing
    await supabase
      .from('videos')
      .update({ status: 'processing' })
      .eq('id', id)

    // Run beta detection (simulated)
    const detections = simulateBetaDetection(video.video_url)

    // Save detections to database
    const { data: savedDetections, error: saveError } = await supabase
      .from('beta_detections')
      .insert(
        detections.map(d => ({
          video_id: id,
          move_type: d.move_type,
          confidence: d.confidence,
          start_time: d.start_time,
          end_time: d.end_time,
          description: d.description || null
        }))
      )
      .select()

    if (saveError) {
      console.error('Save detections error:', saveError)
      await supabase
        .from('videos')
        .update({ status: 'failed' })
        .eq('id', id)
      return NextResponse.json({ error: 'Failed to save detections' }, { status: 500 })
    }

    // Update video status to ready
    await supabase
      .from('videos')
      .update({ status: 'ready' })
      .eq('id', id)

    // Calculate average confidence
    const avgConfidence = detections.reduce((acc, d) => acc + d.confidence, 0) / detections.length

    return NextResponse.json({
      success: true,
      detections: savedDetections,
      stats: {
        total_detections: detections.length,
        avg_confidence: avgConfidence
      }
    })
  } catch (error) {
    console.error('Beta detection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: detections, error } = await supabase
      .from('beta_detections')
      .select('*')
      .eq('video_id', id)
      .order('start_time', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch detections' }, { status: 500 })
    }

    return NextResponse.json({ detections })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
