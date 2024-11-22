import { GroupProps } from '@/types/group.type'
import { PostProps } from '@/types/post.type'
import { SearchAllData, SearchQueryParams } from '@/types/utils.type'
import { User } from '@/types/user.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const search = (params: SearchQueryParams) => {
  return http.get<SuccessResponse<GroupProps[] | User[] | PostProps[] | SearchAllData>>('search', { params })
}
