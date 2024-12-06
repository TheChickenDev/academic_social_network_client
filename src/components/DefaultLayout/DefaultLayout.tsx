import { useContext, useEffect } from 'react'
import Header from '../Header'
import { AppContext } from '@/contexts/app.context'
import { useNavigate } from 'react-router-dom'
import paths, { exceptAdminPaths } from '@/constants/paths'
import { getSocket, initializeSocket } from '@/utils/socket'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, userId } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    const socket = getSocket()
    if (!socket && userId) {
      initializeSocket(userId)
    }
    if (isAdmin) {
      const isPathAllowed = exceptAdminPaths.some((path) => location.pathname.startsWith(path))

      if (!isPathAllowed) {
        navigate(paths.admin)
      }
    }
  }, [isAdmin, location.pathname, navigate])

  return (
    <>
      <Header />
      {children}
    </>
  )
}
