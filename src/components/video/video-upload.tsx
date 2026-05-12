'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn, validateVideoFile } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  FileVideo,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface UploadedFile {
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}

interface VideoUploadProps {
  onUploadComplete?: (file: File, url: string) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  className?: string
}

export function VideoUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  className
}: VideoUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: { file: File; errors: { message: string }[] }[]) => {
    // Handle accepted files
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }))
    
    setFiles(prev => [...prev, ...newFiles].slice(-maxFiles))

    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      const errorMessage = errors.map(e => e.message).join(', ')
      onUploadError?.(`Failed to upload ${file.name}: ${errorMessage}`)
    })

    // Start upload simulation
    newFiles.forEach((uploadFile, index) => {
      simulateUpload(uploadFile.file, index)
    })
  }, [maxFiles, onUploadError])

  const simulateUpload = (file: File, index: number) => {
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, progress: 100, status: 'processing' } : f
        ))

        // Simulate processing
        setTimeout(() => {
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, status: 'complete' } : f
          ))
          
          // Generate a mock URL (in production, this would be the actual uploaded URL)
          const mockUrl = `https://storage.supabase.co/videos/${Date.now()}-${file.name}`
          onUploadComplete?.(file, mockUrl)
        }, 2000)
      } else {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, progress, status: 'uploading' } : f
        ))
      }
    }, 300)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    maxFiles: maxFiles,
    disabled: files.length >= maxFiles,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <FileVideo className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          'dropzone border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          dragActive && 'border-primary bg-primary/5',
          files.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <p className="text-lg font-medium">
              Drop your climbing videos here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse from your device
            </p>
          </div>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>MP4, WebM, MOV</span>
            <span>Up to 500MB</span>
            <span>Max {maxFiles} files</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((uploadedFile, index) => (
            <div
              key={`${uploadedFile.file.name}-${index}`}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card"
            >
              <video
                src={uploadedFile.preview}
                className="w-20 h-12 object-cover rounded"
                muted
                playsInline
                preload="metadata"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{uploadedFile.file.name}</p>
                  {getStatusIcon(uploadedFile.status)}
                </div>
                
                {uploadedFile.status === 'uploading' && (
                  <Progress value={uploadedFile.progress} className="mt-2 h-2" />
                )}
                
                {uploadedFile.status === 'processing' && (
                  <p className="text-xs text-amber-500 mt-1">Processing Beta detection...</p>
                )}
                
                {uploadedFile.status === 'complete' && (
                  <p className="text-xs text-green-500 mt-1">Ready for analysis</p>
                )}
                
                {uploadedFile.status === 'error' && (
                  <p className="text-xs text-destructive mt-1">{uploadedFile.error}</p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                disabled={uploadedFile.status === 'uploading' || uploadedFile.status === 'processing'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
