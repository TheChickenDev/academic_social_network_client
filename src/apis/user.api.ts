import { Friend, User, UserQuery } from '@/types/user.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getUser = (params: UserQuery) => {
  return http.get<SuccessResponse<User | Friend[]>>('users', { params })
}

export const updateUser = (body: FormData) => {
  return http.patch<SuccessResponse<User>>('users', body)
}

export const savePost = (body: { userId: string; postId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/posts?action=save`, body)
}

export const unsavePost = (body: { userId: string; postId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/posts?action=unsave`, body)
}

export const addFriend = (body: { _id: string; friendId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/friends?action=add`, body)
}

export const removeFriend = (body: { _id: string; friendId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/friends?action=remove`, body)
}

export const acceptFriendRequest = (body: { _id: string; friendId: string }) => {
  return http.patch<SuccessResponse<undefined>>(`users/friends?action=accept`, body)
}

export const getFriends = (params: { userId: string; status: string }) => {
  return http.get<SuccessResponse<Friend[]>>('users/friends', { params })
}
