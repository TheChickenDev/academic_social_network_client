interface ActionInfo {
  userId: string
  userName: string
}

export interface CommentProps {
  _id?: string
  postId: string
  parentId?: string
  ownerId: string
  ownerName?: string
  ownerAvatar?: string
  ownerEmail?: string
  createdAt?: string
  updatedAt?: string
  numberOfLikes?: number
  likedBy?: ActionInfo[]
  numberOfDislikes?: number
  dislikedBy?: ActionInfo[]
  numberOfReplies?: number
  replies?: CommentProps[]
  content: object
}

export interface PostProps {
  _id?: string
  title: string
  tags: string[]
  ownerId: string
  ownerName?: string
  ownerAvatar?: string
  ownerEmail?: string
  groupId?: string
  createdAt?: string
  updatedAt?: string
  numberOfLikes?: number
  likedBy?: ActionInfo[]
  numberOfDislikes?: number
  dislikedBy?: ActionInfo[]
  numberOfComments?: number
  content: object
  // virtual fields
  isSaved?: boolean
}

export interface PostQuery {
  _id?: string
  page?: number
  limit?: number
  userEmail?: string
  type?: 'random' | 'own' | 'saved' | 'group'
}

export interface CommentQuery {
  postId?: string
  _id?: string
  page?: number
  limit?: number
  ownerEmail?: string
}
