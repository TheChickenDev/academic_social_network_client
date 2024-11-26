export interface GroupMemberProps {
  userId: string
  userName: string
  userAvatar: string
  userRank: string
  role: 'pending' | 'member' | 'moderator' | 'admin'
  joinDate: Date
  // virtuals
  canAddFriend?: boolean
}

export interface GroupPostProps {
  postId: string
  status: 'pending' | 'approved' | 'rejected'
}

// group
export interface GroupProps {
  _id?: string
  name: string
  description: string
  avatarImg?: string
  backgroundImg?: string
  isPrivate: boolean
  ownerId: string
  members?: GroupMemberProps[]
  moderators?: GroupMemberProps[]
  posts?: GroupPostProps[]
  createdAt?: Date
  updatedAt?: Date
  // virtuals
  postsCount?: number
  membersCount?: number
  canJoin?: boolean
  canPost?: boolean
  canEdit?: boolean
  ownerName?: string
  ownerAvatar?: string
  ownerRank?: string
}

// group query

export interface GroupQuery {
  id?: string
  ownerId?: string
  memberId?: string
  getList?: boolean
  page?: number
  limit?: number
  memberRole?: 'pending' | 'member' | 'moderator' | 'admin'
  postStatus?: 'pending' | 'approved' | 'rejected'
  postId?: string
}
