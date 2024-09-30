export interface SuccessResponse<data> {
  status: string
  message: string
  data: data
}

export interface JWTPayload {
  exp: number
  iat: number
  username: string
  isAdmin: boolean
  fullName: string
  avatar: string
}
