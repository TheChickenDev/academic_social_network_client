import { Friend, User, UserProfileData, UserQuery } from '@/types/user.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getUser = (params: UserQuery) => {
  return http.get<SuccessResponse<(User & UserProfileData) | Friend[]>>('users', { params })
}

export const updateUser = (body: FormData) => {
  return http.patch<SuccessResponse<User & UserProfileData>>('users', body)
}

export const savePost = (body: { ownerEmail: string; postId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/posts?action=save`, body)
}

export const unsavePost = (body: { ownerEmail: string; postId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/posts?action=unsave`, body)
}

export const addFriend = (body: { email: string; friendEmail: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/friends?action=add`, body)
}

export const removeFriend = (body: { email: string; friendEmail: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/friends?action=remove`, body)
}

export const acceptFriendRequest = (body: { email: string; friendEmail: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/friends?action=accept`, body)
}

export const getFriends = (params: { email: string; status: string }) => {
  return http.get<SuccessResponse<Friend[]>>('users/friends', { params })
}
