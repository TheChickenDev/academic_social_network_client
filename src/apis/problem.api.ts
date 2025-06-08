import { ContestProblem, ContestQuery } from '@/types/contest.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createProblem = (body: ContestProblem) => {
  return http.post<SuccessResponse<ContestProblem>>('problems', body)
}

export const getProblems = (contestQuery: ContestQuery) => {
  return http.get<SuccessResponse<ContestProblem[] | ContestProblem>>('problems', { params: contestQuery })
}

export const updateProblem = (body: ContestProblem) => {
  return http.patch<SuccessResponse<ContestProblem>>(`problems`, body)
}

export const submitProblem = (body: {
  problemId: string
  contestId: string
  userId: string
  code: string
  language: string
}) => {
  return http.post<SuccessResponse<ContestProblem>>('problems/submit', body)
}
