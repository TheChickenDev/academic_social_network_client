export interface ContestProps {
  _id?: string
  title?: string
  description?: string
  startDate?: Date
  endDate?: Date
  problems?: Array<{
    problemId?: string
    score?: number
    order?: number
  }>

  participants?: [
    {
      userId?: string
      userName?: string
      userAvatar?: string
      userEmail?: string
      userRank?: number
      score?: number
    }
  ]
  hidden?: boolean
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ContestProblem {
  _id?: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
  testCases?: Array<{
    input: string
    output: string
  }>
  sampleCode?: {
    javascript: string
    python: string
    java: string
    c: string
    cpp: string
  }
  createdBy: string
  createdAt?: Date
  updatedAt?: Date

  isSolved?: boolean
  submitedCode?: string
}

export interface ContestSubmission {
  _id?: string
  userId: string
  contestId: string
  problemId: string
  language: string
  code: string
  status: 'pending' | 'accepted' | 'wrong answer' | 'runtime error' | 'compilation error'
  createdAt?: Date
  updatedAt?: Date
}

export interface ContestQuery {
  page?: number
  limit?: number
  title?: string
  startDate?: string
  endDate?: string
  hidden?: boolean
  createdBy?: string
  problemId?: string
  contestId?: string
  userId?: string
}
