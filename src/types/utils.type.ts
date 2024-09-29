export interface SuccessResponse<data> {
  status: string
  message: string
  data: data
}

export interface JWTPayload {
  exp: number
  iat: number
  id: string
  isAdmin: boolean
  email: string
  avatar: string
  name: string
  phone: string
  address: string
}
