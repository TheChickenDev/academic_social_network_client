import { CommentProps, CommentQuery } from '@/types/post.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getCommentsByPostId = (params: CommentQuery) => {
  return http.get<SuccessResponse<CommentProps[]>>(`comments`, { params })
}

export const likeComment = (id: string, body: { userId: string }) => {
  return http.post<SuccessResponse<CommentProps>>(`comments/${id}?action=like`, body)
}

export const dislikeComment = (id: string, body: { userId: string }) => {
  return http.post<SuccessResponse<CommentProps>>(`comments/${id}?action=dislike`, body)
}

export const submitComment = (body: CommentProps) => {
  return http.post<SuccessResponse<CommentProps>>(`comments`, body)
}

export const replyComment = (body: CommentProps) => {
  return http.post<SuccessResponse<CommentProps>>(`comments/replies`, body)
}
