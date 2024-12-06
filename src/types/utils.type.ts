import { GroupProps } from './group.type'
import { PostProps } from './post.type'
import { Friend } from './user.type'

export interface SuccessResponse<data> {
  status: string
  message: string
  data: data
}

export interface JWTPayload {
  exp: number
  iat: number
  _id: string
  email: string
  isAdmin: boolean
  fullName: string
  avatar: string
}

export interface SearchQueryParams {
  q: string
  type: string
  filter: string
  userId?: string
  page?: number
  limit?: number
}

export interface SearchAllData {
  posts: PostProps[]
  users: Friend[]
  groups: GroupProps[]
}

export interface Notification {
  _id: string
  type:
    | 'sendFriendRequest'
    | 'acceptFriendRequest'
    | 'rejectFriendRequest'
    | 'unfriend'
    | 'joinGroup'
    | 'leaveGroup'
    | 'createPost'
    | 'commentPost'
  groupId?: string
  groupName?: string
  userId: string
  userName: string
  avatarImg: string
  isRead: boolean
  time: string
}
