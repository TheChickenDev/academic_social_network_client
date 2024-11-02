import { PostProps, PostQuery } from '@/types/post.type'
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
