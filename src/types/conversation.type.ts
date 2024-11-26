import { MessageContent } from './message.type'

export interface Conversation {
  _id: string
  userEmail: string
  userRank: string
  userName: string
  avatarImg: string
  lastMessage: MessageContent
}

export interface ConversationQuery {
  userId: string
  page: number
  limit: number
}
