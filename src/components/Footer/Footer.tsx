import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { isAuthenticated } = useContext(AppContext)
  return <div>Footer</div>
}
