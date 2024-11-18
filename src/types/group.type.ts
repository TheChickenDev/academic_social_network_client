export interface GroupMemberProps {
  groupId: string
  groupName: string
  role: 'Member' | 'Moderator' | 'Admin'
  contributionPoints: number
  title: string
  joinDate: Date
}

// group
export interface GroupProps {
  _id?: string
  name: string
  description: string
  avatarImg?: string
  backgroundImg?: string
  ownerEmail: string
  memberrs?: GroupMemberProps[]
  createdAt?: Date
  updatedAt?: Date
}

// group query

export interface GroupQuery {
  id?: string
  ownerEmail?: string
}
