import { GroupMemberProps, GroupProps, GroupQuery } from '@/types/group.type'
import { PostProps } from '@/types/post.type'
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

export const deleteGroup = (id: string) => {
  return http.delete<SuccessResponse<GroupProps>>(`groups/${id}`)
}

export const getMembers = (params: GroupQuery) => {
  return http.get<SuccessResponse<GroupMemberProps[]>>('groups/members', { params })
}

export const requestToJoin = (body: GroupQuery) => {
  return http.patch<SuccessResponse<GroupMemberProps>>('groups/members?action=request', body)
}

export const acceptJoinRequest = (body: GroupQuery) => {
  return http.patch<SuccessResponse<GroupMemberProps>>('groups/members?action=accept', body)
}

export const rejectJoinRequest = (body: GroupQuery) => {
  return http.patch<SuccessResponse<GroupMemberProps>>('groups/members?action=reject', body)
}

export const leaveGroup = (body: GroupQuery) => {
  return http.patch<SuccessResponse<GroupMemberProps>>('groups/members?action=leave', body)
}

export const removeMember = (body: GroupQuery) => {
  return http.patch<SuccessResponse<GroupMemberProps>>('groups/members?action=remove', body)
}

export const appointModerator = (body: GroupQuery) => {
  return http.patch<SuccessResponse<GroupMemberProps>>('groups/members?action=appoint', body)
}

export const dismissalModerator = (body: GroupQuery) => {
  return http.patch<SuccessResponse<GroupMemberProps>>('groups/members?action=dismissal', body)
}

export const getGroupPosts = (params: GroupQuery) => {
  return http.get<SuccessResponse<PostProps[] | PostProps>>('groups/posts', { params })
}

export const approvePost = (body: GroupQuery) => {
  return http.patch<SuccessResponse<PostProps>>('groups/posts?action=approve', body)
}

export const rejectPost = (body: GroupQuery) => {
  return http.patch<SuccessResponse<PostProps>>('groups/posts?action=reject', body)
}
