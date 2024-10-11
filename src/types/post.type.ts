export interface CommentProps {
  userName: string
  userAvatar: string
  date: string
  numberOfLikes: number
  numberOfDislikes: number
  content: string
}

export interface PostProps {
  title: string
  tags: string[]
  userName: string
  userAvatar: string
  date: string
  numberOfLikes: number
  numberOfDislikes: number
  numberOfComments: number
  content: string
  comments: CommentProps[]
}
