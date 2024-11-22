import { User } from '@/types/user.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'
import axios from 'axios'
import { GoogleLoginFormData, LoginFormData, RegisterFormData, ResetPasswordFormData } from '@/types/rule.type'

type AuthResponse = {
  access_token: string
  refresh_token: string
  user: User
}

export const registerAccount = (body: RegisterFormData) => {
  return http.post<SuccessResponse<AuthResponse>>('users/', body)
}

export const login = (body: LoginFormData) => {
  return http.post<SuccessResponse<AuthResponse>>('users/login', body)
}

export const loginGoogle = (body: GoogleLoginFormData) => {
  return http.post<SuccessResponse<AuthResponse>>('users/login-google', body)
}

export const getGoogleInfo = (access_token: string) => {
  return axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json'
    }
  })
}

export const logout = () => {
  return http.post<SuccessResponse<null>>('users/logout')
}

export const refreshAccessToken = () => {
  return http.post<SuccessResponse<string>>('users/refresh-token')
}

export const forgotPassword = (body: ResetPasswordFormData) => {
  return http.post<SuccessResponse<null>>('users/forgot-password', body)
}

export const resetPassword = (body: ResetPasswordFormData) => {
  return http.post<SuccessResponse<AuthResponse>>('users/reset-password', body)
}
