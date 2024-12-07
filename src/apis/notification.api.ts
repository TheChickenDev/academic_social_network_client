import { Notification, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getNotifications = (params: { userId: string }) => {
  return http.get<SuccessResponse<Notification[]>>('notifications', { params })
}

export const markNotificationAsRead = (body: { userId: string }) => {
  return http.put<SuccessResponse<Notification>>(`notifications`, body)
}
