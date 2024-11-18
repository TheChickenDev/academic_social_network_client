import { PostProps } from './post.type'

// job
export interface Job {
  profession: string
  company: string
  fromDate: Date
  toDate: Date
  untilNow: boolean
  description: string
  isPrivate: boolean
}

// education
export interface Education {
  schoolName: string
  fromDate: Date
  toDate: Date
  untilNow: boolean
  isPrivate: boolean
}

// contact
interface Contact {
  phone: string
  links: string[]
  isPrivate: boolean
}

// introduction
interface Introduction {
  jobs: Job[]
  educations: Education[]
  address: string
  contact: Contact
}

// friend

export interface Friend {
  email: string
  fullName: string
  rank: string
  points: number
  avatarImg: string
  canAddFriend: boolean
  canAccept: boolean
}

// user
export interface User {
  _id: string
  googleId: string
  email: string
  password: string
  fullName: string
  dateOfBirth: Date
  gender: 'Male' | 'Female' | 'Other' | ''
  introduction: Introduction
  description: string
  points: number
  rank: string
  savedPosts: string[]
  avatarImg: string
  isAdmin: boolean
  isActive: boolean
  accessToken: string
  refreshToken: string
  createdAt: Date
  updatedAt: Date
}

//

export interface UserProfileData {
  posts: PostProps[]
  friends: string[]
}

export interface UserQuery {
  email: string
  _id?: string
  page?: number
  limit?: number
}
