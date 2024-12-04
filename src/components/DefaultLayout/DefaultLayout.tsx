import { useContext, useEffect } from 'react'
import Header from '../Header'
import { AppContext } from '@/contexts/app.context'
import { useNavigate } from 'react-router-dom'
import paths, { exceptAdminPaths } from '@/constants/paths'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
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
