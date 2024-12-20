export type LoginFormData = {
  email: string
  password: string
}

export type GoogleLoginFormData = {
  googleId: string
  name: string
  email: string
  avatar: string
}

export type RegisterFormData = {
  name?: string
  email: string
  password: string
  confirm_password: string
}

export type UpdateFormData = {
  name: string
  phone: string
  address: string
  avatar?: FileList | null
}

export type ForgotPasswordFormData = {
  email: string
}

export type ResetPasswordFormData = {
  email?: string
  token?: string
  password?: string
  confirm_password?: string
}

export type SendMessageFormData = {
  name: string
  email: string
  message: string
}
