export interface Content {
  content: string
  type: 'text' | 'code' | 'image' | string
  language: string | null
}

export interface CommentProps {
  userName: string
  userAvatar: string
  date: string
  numberOfLikes: number
  numberOfDislikes: number
  contents: Content[]
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
  contents: Content[]
  comments: CommentProps[]
}
