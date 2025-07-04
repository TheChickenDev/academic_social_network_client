import { avatarImg } from '@/assets/images'
import { getAccessTokenFromLocalStorage } from '@/utils/auth'
import { getUserInfoFromJWT } from '@/utils/utils'
import { createContext, useEffect, useState } from 'react'
import i18n from '@/i18n'

const userInfo = getUserInfoFromJWT()

const themeStorageKey = 'vite-ui-theme'
type Theme = 'dark' | 'light' | 'system'

type Language = 'en' | 'vi'
const languageStorageKey = 'vite-ui-language'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isAdmin?: boolean
  setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>
  userId?: string
  setUserId?: React.Dispatch<React.SetStateAction<string>>
  email?: string
  setEmail?: React.Dispatch<React.SetStateAction<string>>
  fullName?: string
  setFullName?: React.Dispatch<React.SetStateAction<string>>
  avatar?: string
  setAvatar?: React.Dispatch<React.SetStateAction<string>>
  theme: Theme
  setTheme: (theme: Theme) => void
  language: Language
  setLanguage: (language: Language) => void

  localStream?: MediaStream | null
  setLocalStream?: React.Dispatch<React.SetStateAction<MediaStream | null>>
  socketCallInfo?: {
    isVideoCall: boolean
    receiverId: string
    receiverName: string
    receiverAvatar: string
    senderId: string
  } | null
  setSocketCallInfo?: React.Dispatch<
    React.SetStateAction<{
      isVideoCall: boolean
      receiverId: string
      receiverName: string
      receiverAvatar: string
      senderId: string
    } | null>
  >
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  isAdmin: userInfo?.isAdmin,
  setIsAdmin: () => null,
  userId: userInfo?._id,
  setUserId: () => null,
  email: userInfo?.email,
  setEmail: () => null,
  fullName: userInfo?.fullName,
  setFullName: () => null,
  avatar: userInfo?.avatar ?? avatarImg,
  setAvatar: () => null,
  theme: localStorage.getItem(themeStorageKey) as Theme,
  setTheme: () => null,
  language: localStorage.getItem(languageStorageKey) as Language,
  setLanguage: () => null,
  localStream: null,
  setLocalStream: () => null,
  socketCallInfo: null,
  setSocketCallInfo: () => null
}

interface AppProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultLanguage?: Language
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

const AppProvider = ({ children, defaultTheme = 'system', defaultLanguage = 'en' }: AppProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [userId, setUserId] = useState<string>(initialAppContext.userId ?? '')
  const [isAdmin, setIsAdmin] = useState<boolean>(initialAppContext.isAdmin ?? false)
  const [email, setEmail] = useState<string>(initialAppContext.email ?? '')
  const [fullName, setFullName] = useState<string>(initialAppContext.fullName ?? '')
  const [avatar, setAvatar] = useState<string>(initialAppContext.avatar ?? '')
  const [theme, setTheme] = useState<Theme>(() => initialAppContext.theme ?? defaultTheme)
  const [language, setLanguage] = useState<Language>(initialAppContext.language ?? defaultLanguage)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [socketCallInfo, setSocketCallInfo] = useState<{
    isVideoCall: boolean
    receiverId: string
    receiverName: string
    receiverAvatar: string
    senderId: string
  } | null>(null)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      root.classList.add(systemTheme)
      return
    }
    root.classList.add(theme)
    localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  useEffect(() => {
    i18n.changeLanguage(language)
    localStorage.setItem(languageStorageKey, language)
  }, [language])

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userId,
        setUserId,
        isAdmin,
        setIsAdmin,
        email,
        setEmail,
        fullName,
        setFullName,
        avatar,
        setAvatar,
        theme,
        setTheme,
        language,
        setLanguage,
        localStream,
        setLocalStream,
        socketCallInfo,
        setSocketCallInfo
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
