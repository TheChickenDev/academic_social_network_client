export interface SuccessResponse<data> {
  status: string
  message: string
  data: data
}

export interface JWTPayload {
  exp: number
  iat: number
  email: string
  isAdmin: boolean
  fullName: string
  avatar: string
}
