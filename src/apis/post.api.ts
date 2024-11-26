import { PostProps, PostQuery } from '@/types/post.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createPost = (body: PostProps) => {
  return http.post<SuccessResponse<PostProps>>('posts', body)
}

export const getPosts = (params: PostQuery) => {
  return http.get<SuccessResponse<PostProps[]>>('posts', { params })
}

export const getPostsById = (id: string, params: { userEmail: string }) => {
  return http.get<SuccessResponse<PostProps>>(`posts/${id}`, { params })
}

export const likePost = (id: string, body: { userId: string }) => {
  return http.post<SuccessResponse<PostProps>>(`posts/${id}?action=like`, body)
}

export const dislikePost = (id: string, body: { userId: string }) => {
  return http.post<SuccessResponse<PostProps>>(`posts/${id}?action=dislike`, body)
}

export const deletePost = (id: string) => {
  return http.delete<SuccessResponse<PostProps>>(`posts/${id}`)
}
