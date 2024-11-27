export interface MessageContent {
  type: 'text' | 'image' | 'video' | 'audio' | 'icon'
  content: string
}

export interface Message {
  _id?: string
  conversationId: string
  senderId: string
  senderAvatar: string
  message: MessageContent
  createdAt?: Date
}

export interface MessageQuery {
  conversationId: string
  userId: string
  page: number
  limit: number
}
