export interface ActionInfo {
  ownerName: string
  ownerEmail: string
}

export interface Tag {
  label: string
  value: string
}

export interface ReplyProps {
  _id?: string
  postId: string
  commentId: string
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  createdAt?: string
  updatedAt?: string
  numberOfLikes?: number
  likes?: ActionInfo[]
  numberOfDislikes?: number
  dislikes?: ActionInfo[]
  content: object
}
export interface CommentProps {
  _id?: string
  postId: string
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  createdAt?: string
  updatedAt?: string
  numberOfLikes?: number
  likes?: ActionInfo[]
  numberOfDislikes?: number
  dislikes?: ActionInfo[]
  numberOfReplies?: number
  replies?: ReplyProps[]
  content: object
}

export interface PostProps {
  _id?: string
  title: string
  tags: Tag[]
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  groupId?: string
  createdAt?: string
  updatedAt?: string
  numberOfLikes?: number
  likes?: ActionInfo[]
  numberOfDislikes?: number
  dislikes?: ActionInfo[]
  numberOfComments?: number
  content: object
  // virtual fields
  isSaved?: boolean
}

export interface PostQuery {
  _id?: string
  page?: number
  limit?: number
  ownerEmail?: string
  userEmail?: string
  groupId?: string
  getSavedPosts?: boolean
}

export interface CommentQuery {
  postId?: string
  _id?: string
  page?: number
  limit?: number
  ownerEmail?: string
}
