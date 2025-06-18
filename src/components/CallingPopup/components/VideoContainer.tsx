import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface VideoContainerProps {
  stream: MediaStream | null
  isLocalStream: boolean
  isVideo: boolean // ✅ Thêm để phân biệt audio/video
}

export default function VideoContainer({ stream, isLocalStream, isVideo = true }: VideoContainerProps) {
  const mediaRef = useRef<HTMLMediaElement>(null)

  useEffect(() => {
    if (mediaRef.current && stream) {
      mediaRef.current.srcObject = stream
    }
  }, [stream])

  if (!stream) return null

  return isVideo ? (
    <video
      ref={mediaRef as React.RefObject<HTMLVideoElement>}
      className={cn('rounded-sm w-full h-[50vh] object-cover', {
        'absolute top-2 left-2 z-10 w-48 h-auto border-purple-500 border-2': isLocalStream
      })}
      autoPlay
      playsInline
      muted={isLocalStream}
    />
  ) : (
    <audio
      ref={mediaRef as React.RefObject<HTMLAudioElement>}
      className='hidden' // Ẩn player vì không cần UI cho audio call
      autoPlay
      muted={isLocalStream}
      playsInline
      controls={false}
    />
  )
}
