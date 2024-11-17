import { User, UserProfileData, UserQuery } from '@/types/user.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getUser = (params: UserQuery) => {
  return http.get<SuccessResponse<User & UserProfileData>>('users', { params })
}

export const updateUser = (body: FormData) => {
  return http.patch<SuccessResponse<User & UserProfileData>>('users', body)
}

export const savePost = (body: { ownerEmail: string; postId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/save-post`, body)
}

export const unsavePost = (body: { ownerEmail: string; postId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/unsave-post`, body)
}
