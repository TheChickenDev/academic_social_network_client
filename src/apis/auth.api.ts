import { User } from '@/types/user.type'
import { SuccessResponse } from '@/types/utils.type'
import http from 'src/utils/http'
import { ForgotPasswordFormData, LoginFormData, ResetPasswordFormData } from 'src/utils/rules'

type AuthResponse = {
  access_token: string
  refresh_token: string
  user: User
}

export const registerAccount = (body: FormData) => {
  return http.post<SuccessResponse<AuthResponse>>('user/register', body)
}

export const login = (body: LoginFormData) => {
  return http.post<SuccessResponse<AuthResponse>>('user/login', body)
}

export const logout = () => {
  return http.post<SuccessResponse<null>>('user/logout')
}

export const refreshAccessToken = () => {
  return http.post<SuccessResponse<string>>('user/refresh-token')
}

export const forgotPassword = (body: ForgotPasswordFormData) => {
  return http.post<SuccessResponse<string>>('user/forgot-password', body)
}

export const resetPassword = (body: ResetPasswordFormData) => {
  return http.patch<SuccessResponse<null>>('user/reset-password', body)
}
