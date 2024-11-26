import { jwtDecode } from 'jwt-decode'
import { JWTPayload } from 'src/types/utils.type'

export const decodeJWT = (token: string): JWTPayload => {
  return jwtDecode(token)
}

export const getUserInfoFromJWT = (): JWTPayload | null => {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  return decodeJWT(token)
}

export const convertISODateToLocaleString = (date: string | undefined): string => {
  const parsedDate = new Date(date ?? '')
  const timeString = parsedDate.toLocaleTimeString('en-BG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateString = parsedDate.toLocaleDateString('en-BG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  return `${timeString} ${dateString}`
}

export const getValidYearForAgePicker = () => {
  const eighteenYearsAgo = new Date()
  return new Date(eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18))
}

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
