export interface CommentProps {
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  date: string
  numberOfLikes: number
  numberOfDislikes: number
  content: string
}

export interface PostProps {
  title: string
  tags: string[]
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  date: string
  numberOfLikes: number
  numberOfDislikes: number
  numberOfComments: number
  content: string
  comments: CommentProps[]
}
