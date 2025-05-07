import { ContestProps, ContestQuery } from '@/types/contest.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createContest = (body: ContestProps) => {
  return http.post<SuccessResponse<ContestProps>>('contests', body)
}

export const getContests = (contestQuery: ContestQuery) => {
  return http.get<SuccessResponse<ContestProps[]>>('contests', { params: contestQuery })
}

export const updateContest = (body: ContestProps) => {
  return http.patch<SuccessResponse<ContestProps>>(`contests`, body)
}
