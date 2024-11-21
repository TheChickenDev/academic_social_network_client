export interface MessageContent {
  type: 'text' | 'image' | 'video' | 'audio' | 'icon'
  content: string
}

export interface Message {
  _id?: string
  conversationId: string
  senderEmail: string
  senderAvatar: string
  message: MessageContent
  createdAt?: Date
}

export interface MessageQuery {
  conversationId: string
  userEmail: string
  page: number
  limit: number
}
