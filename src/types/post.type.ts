import { Option } from '@/components/ui/multi-select'

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
  numberOfDislikes?: number
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
  numberOfDislikes?: number
  content: string
  replies?: ReplyProps[]
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
  numberOfDislikes?: number
  numberOfComments?: number
  content: string
  comments?: CommentProps[]
}

export interface PostQuery {
  _id?: string
  commentFilter?: string
  page?: number
  limit?: number
  ownerEmail?: string
}
