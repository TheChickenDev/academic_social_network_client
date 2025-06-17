import { useContext, useEffect, useRef } from 'react'
import Header from '../Header'
import { AppContext } from '@/contexts/app.context'
import { Link, useNavigate } from 'react-router-dom'
import paths, { exceptAdminPaths } from '@/constants/paths'
import { getSocket, initializeSocket } from '@/utils/socket'
import { toast } from 'sonner'
import { Notification } from '@/types/utils.type'
import { useTranslation } from 'react-i18next'
import CallingPopup from '../CallingPopup'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, userId, localStream } = useContext(AppContext)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (localStream !== undefined) {
      localStreamRef.current = localStream ?? null
    }
  }, [localStream])

  useEffect(() => {
    if (isAdmin) {
      const isPathAllowed = exceptAdminPaths.some((path) => location.pathname.startsWith(path))

      if (!isPathAllowed) {
        navigate(paths.admin)
        return
      }
    }

    let socket = getSocket()
    if (!socket && userId) {
      socket = initializeSocket(userId)
    }
    if (userId && socket) {
      socket.on('notify', (response) => {
        const notification: Notification = response
        if (!notification) {
          return
        }

        toast(
          <div>
            <Link to={paths.profile.replace(':id', notification?.userId ?? '')} className='font-bold'>
              {notification?.userName}
            </Link>
            <span>{t(`notifications.${notification?.type}`)}</span>
            {notification?.groupName && (
              <Link to={paths.groupDetails.replace(':id', notification?.groupId ?? '')} className='font-bold'>
                {notification?.groupName}
              </Link>
            )}
          </div>
        )
      })

      return () => {
        socket.off('notify')
        socket.off('incoming call')
        socket.off('reject call')
      }
    }
  }, [isAdmin, location.pathname, navigate])

  return (
    <>
      <Header />
      <CallingPopup />
      {children}
    </>
  )
}
