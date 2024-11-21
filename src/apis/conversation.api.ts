import { Conversation, ConversationQuery } from '@/types/conversation.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getConversations = (params: ConversationQuery) => {
  return http.get<SuccessResponse<Conversation[]>>('conversations', { params })
}
