import { PostProps } from '@/types/post.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createPost = (body: FormData) => {
  return http.post<SuccessResponse<PostProps>>('post', body)
}
