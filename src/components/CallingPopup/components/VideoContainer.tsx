import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface VideoContainer {
  stream: MediaStream | null
  isLocalStream: boolean
}

export default function VideoContainer({ stream, isLocalStream }: VideoContainer) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <video
      className={cn('rounded-sm', {
        'absolute top-0 left-0 z-10 w-48 h-auto border-purple-500 border-2': isLocalStream
      })}
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocalStream}
    />
  )
}
