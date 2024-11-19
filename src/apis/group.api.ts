import { GroupProps, GroupQuery } from '@/types/group.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createGroup = (body: GroupProps) => {
  return http.post<SuccessResponse<GroupProps>>('groups', body)
}

export const getGroups = (params: GroupQuery) => {
  return http.get<SuccessResponse<GroupProps[] | GroupProps>>('groups', { params })
}

export const updateGroup = (body: FormData) => {
  return http.patch<SuccessResponse<GroupProps>>('groups', body)
}

export const getMembers = (params: GroupQuery) => {
  return http.get<SuccessResponse<GroupProps[]>>('groups/members', { params })
}
