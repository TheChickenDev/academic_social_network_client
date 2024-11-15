import { User, UserProfileData, UserQuery } from '@/types/user.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getUser = (params: UserQuery) => {
  return http.get<SuccessResponse<User & UserProfileData>>('users', { params })
}
