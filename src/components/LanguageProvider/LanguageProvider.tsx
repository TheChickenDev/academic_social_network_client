import React, { createContext, useContext, useEffect, useState } from 'react'
import i18n from '@/i18n'

type Language = 'en' | 'vi'

interface LanguageProviderState {
  language: Language
  setLanguage: (language: Language) => void
}

const initialState: LanguageProviderState = {
  language: 'en',
  setLanguage: () => null
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}

export default function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'vite-ui-language',
  ...props
}: {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  )

  useEffect(() => {
    i18n.changeLanguage(language)
    localStorage.setItem(storageKey, language)
  }, [language, storageKey])

  const value = {
    language,
    setLanguage
  }

  return (
    <LanguageProviderContext.Provider value={value} {...props}>
      {children}
    </LanguageProviderContext.Provider>
  )
}
