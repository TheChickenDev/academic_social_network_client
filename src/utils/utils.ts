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
