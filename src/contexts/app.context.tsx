import { avatarImg } from '@/assets/images'
import { getAccessTokenFromLocalStorage } from '@/utils/auth'
import { getUserInfoFromJWT } from '@/utils/utils'
import { createContext, useState } from 'react'

const userInfo = getUserInfoFromJWT()

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isAdmin?: boolean
  fullName?: string
  setFullName?: React.Dispatch<React.SetStateAction<string>>
  avatar?: string
  setAvatar?: React.Dispatch<React.SetStateAction<string>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  isAdmin: userInfo?.isAdmin,
  fullName: userInfo?.fullName,
  setFullName: () => null,
  avatar: userInfo?.avatar ?? avatarImg,
  setAvatar: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [fullName, setFullName] = useState<string>(initialAppContext.fullName ?? '')
  const [avatar, setAvatar] = useState<string>(initialAppContext.avatar ?? '')

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        fullName,
        setFullName,
        avatar,
        setAvatar
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
