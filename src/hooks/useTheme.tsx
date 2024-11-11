import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'

export const useTheme = () => {
  const context = useContext(AppContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
