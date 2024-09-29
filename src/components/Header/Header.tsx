import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import ModeToggle from '../ModeToggle/ModeToggle'

export default function Header() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext)
  return (
    <div>
      <ModeToggle />
    </div>
  )
}
