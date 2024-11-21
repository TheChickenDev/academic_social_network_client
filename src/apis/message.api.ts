import { Message, MessageQuery } from '@/types/message.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getMessages = (params: MessageQuery) => {
  return http.get<SuccessResponse<Message[]>>('messages', { params })
}
