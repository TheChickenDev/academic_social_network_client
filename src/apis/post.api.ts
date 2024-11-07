import { ActionInfo, CommentProps, PostProps, PostQuery, ReplyProps } from '@/types/post.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createPost = (body: PostProps) => {
  return http.post<SuccessResponse<PostProps>>('posts', body)
}

export const getPosts = (params: PostQuery) => {
  return http.get<SuccessResponse<PostProps[]>>('posts', { params })
}

export const getPostsById = (id: string) => {
  return http.get<SuccessResponse<PostProps>>(`posts/${id}`)
}

export const likePost = (id: string, body: ActionInfo) => {
  return http.post<SuccessResponse<PostProps>>(`posts/${id}/like`, body)
}

export const dislikePost = (id: string, body: ActionInfo) => {
  return http.post<SuccessResponse<PostProps>>(`posts/${id}/dislike`, body)
}

export const submitComment = (body: CommentProps) => {
  return http.post<SuccessResponse<CommentProps>>(`comments`, body)
}

export const replyComment = (body: CommentProps) => {
  return http.post<SuccessResponse<ReplyProps>>(`comments/reply`, body)
}
