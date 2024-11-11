import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'

export const useLanguage = () => {
  const context = useContext(AppContext)

  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}
