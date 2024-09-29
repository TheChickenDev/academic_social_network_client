import { jwtDecode } from 'jwt-decode'
import { userImg } from 'src/assets/images'
import { JWTPayload } from 'src/types/utils.type'

export const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export const formatNumberToSocialStyle = (value: number): string => {
  return new Intl.NumberFormat('en-EN', { notation: 'compact', maximumFractionDigits: 2 }).format(value)
}

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const formattedDate = `${day}/${month}/${year}`

  return formattedDate
}

export const decodeJWT = (token: string): JWTPayload => {
  return jwtDecode(token)
}

export const getEmailFromJWT = (token: string): string => {
  if (!token) return userImg.defaultAvatar
  const { email } = decodeJWT(token)
  return email
}

export const getAvatarFromJWT = (token: string): string => {
  if (!token) return 'anonymous@hein.shop'
  const { avatar } = decodeJWT(token)
  return avatar
}

export const calculateDifferenceBetweenNowAndFutureDate = (
  futureDate: string
): {
  diffDays: number
  diffHours: number
  diffMinutes: number
  diffSeconds: number
  isExpired: boolean
} => {
  const expiredDate = new Date(futureDate)
  const currentDate = new Date()
  let diffTime = expiredDate.getTime() - currentDate.getTime()
  if (diffTime <= 0) {
    return {
      diffDays: 0,
      diffHours: 0,
      diffMinutes: 0,
      diffSeconds: 0,
      isExpired: true
    }
  }
  diffTime = Math.abs(diffTime)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  diffTime = diffTime - diffDays * (1000 * 60 * 60 * 24)
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  diffTime = diffTime - diffHours * (1000 * 60 * 60)
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  diffTime = diffTime - diffMinutes * (1000 * 60)
  const diffSeconds = Math.floor(diffTime / 1000)
  diffTime = diffTime - diffSeconds * 1000
  return {
    diffDays,
    diffHours,
    diffMinutes,
    diffSeconds,
    isExpired: false
  }
}
