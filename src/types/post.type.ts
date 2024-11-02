import { Option } from '@/components/ui/multi-select'

export interface CommentProps {
  _id?: string
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  createdAt?: string
  numberOfLikes?: number
  numberOfDislikes?: number
  content: string
  answers?: Omit<CommentProps, 'answers'>[]
}

export interface PostProps {
  _id?: string
  title: string
  tags: Option[]
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  createdAt?: string
  numberOfLikes?: number
  numberOfDislikes?: number
  numberOfComments?: number
  content: string
  comments?: CommentProps[]
}

export interface PostQuery {
  page: number
  limit: number
  ownerEmail?: string
}
