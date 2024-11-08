import { ActionInfo, CommentProps, CommentQuery, ReplyProps } from '@/types/post.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getCommentsByPostId = (params: CommentQuery) => {
  return http.get<SuccessResponse<CommentProps[]>>(`comments`, { params })
}

export const likeComment = (id: string, body: ActionInfo & { commentId: string }) => {
  return http.post<SuccessResponse<CommentProps>>(`comments/${id}/like`, body)
}

export const dislikeComment = (id: string, body: ActionInfo & { commentId: string }) => {
  return http.post<SuccessResponse<CommentProps>>(`comments/${id}/dislike`, body)
}

export const submitComment = (body: CommentProps) => {
  return http.post<SuccessResponse<CommentProps>>(`comments`, body)
}

export const replyComment = (body: CommentProps) => {
  return http.post<SuccessResponse<ReplyProps>>(`comments/reply`, body)
}
