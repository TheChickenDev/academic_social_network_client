export interface GroupMemberProps {
  userEmail: string
  userName: string
  userAvatar: string
  userRank: string
  role: 'pending' | 'member' | 'moderator' | 'admin'
  joinDate: Date
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
  ownerEmail: string
  members?: GroupMemberProps[]
  moderators?: GroupMemberProps[]
  posts?: GroupPostProps[]
  createdAt?: Date
  updatedAt?: Date
  // virtuals
  postsCount: number
  membersCount: number
  canJoin: boolean
  canPost: boolean
  ownerName: string
  ownerAvatar: string
  ownerRank: string
}

// group query

export interface GroupQuery {
  id?: string
  ownerEmail?: string
  userEmail?: string
  memberRole?: 'member' | 'moderator' | 'admin'
}
