import { MessageContent } from './message.type'

export interface Conversation {
  _id: string
  userId: string
  userRank: string
  userName: string
  avatarImg: string
  lastMessage: MessageContent & { senderId: string }
}

export interface ConversationQuery {
  userId: string
  page: number
  limit: number
}
