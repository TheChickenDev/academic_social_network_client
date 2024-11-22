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
  email: string
  isAdmin: boolean
  fullName: string
  avatar: string
}

export interface SearchQueryParams {
  q: string
  type: string
  filter: string
  email?: string
  page?: number
  limit?: number
}

export interface SearchAllData {
  posts: PostProps[]
  users: Friend[]
  groups: GroupProps[]
}
