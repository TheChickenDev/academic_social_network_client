import { Option } from '@/components/ui/multi-select'

export interface ActionInfo {
  ownerName: string
  ownerEmail: string
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
  content: string
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
  content: string
}

export interface PostProps {
  _id?: string
  title: string
  tags: Option[]
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  createdAt?: string
  updatedAt?: string
  numberOfLikes?: number
  likes?: ActionInfo[]
  numberOfDislikes?: number
  dislikes?: ActionInfo[]
  numberOfComments?: number
  comments?: CommentProps[]
  content: string
}

export interface PostQuery {
  _id?: string
  commentFilter?: string
  page?: number
  limit?: number
  ownerEmail?: string
}
