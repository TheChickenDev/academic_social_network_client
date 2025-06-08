import { runCode } from '@/apis/judge0.api'
import { getProblems, submitProblem } from '@/apis/problem.api'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cppSample, cSample, javaSample, javascriptSample, pythonSample } from '@/constants/code'
import { AppContext } from '@/contexts/app.context'
import { ContestProblem } from '@/types/contest.type'
import { Editor } from '@monaco-editor/react'
import { ArrowLeft, ArrowRight, CheckCheck, CircleCheck, CircleX, CodeXml, RotateCcw, Sparkles } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

interface Result {
  correctTestCases: number
  excutionTime: number
  message: string
  accepted?: boolean
}

export default function Problem({ problemIds }: { problemIds: Array<string> }) {
  const { t } = useTranslation()
  const [code, setCode] = useState(javascriptSample)
  const [language, setLanguage] = useState<string>('javascript')
  const [problem, setProblem] = useState<ContestProblem>({} as ContestProblem)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [result, setResult] = useState<Result>({
    correctTestCases: 0,
    excutionTime: 0,
    message: t('admin.problem.wrongAnswer'),
    accepted: false
  })
  const [problemIndex, setProblemIndex] = useState<number>(0)

  const { userId } = useContext(AppContext)
  const { id: contestId } = useParams()

  useEffect(() => {
    setIsLoading(true)
    setShowResult(false)
    setResult({
      correctTestCases: 0,
      excutionTime: 0,
      message: t('admin.problem.wrongAnswer'),
      accepted: false
    })
    getProblems({ problemId: problemIds[problemIndex], userId })
      .then((res) => {
        const problem = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
        setProblem(problem)
        setCode(problem.submitedCode || problem.sampleCode?.javascript || javascriptSample)
      })
      .catch((err) => {
        console.error('Error fetching problem:', err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [problemIndex])

  const handleSubmit = () => {
    setIsLoading(true)
    submitProblem({
      userId: userId || '',
      problemId: problem._id || '',
      contestId: contestId || '',
      code,
      language
    })
      .then((res) => {
        console.log('Submission successful:', res.data)
        setProblem((prev) => ({ ...prev, isSolved: true }))
        setShowResult(true)
      })
      .catch((err) => {
        console.error('Error submitting problem:', err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleRun = async () => {
    setIsLoading(true)
    const languageId = getLanguageId(language)
    let correctTestCases = 0
    let excutionTime = 0
    let message = ''
    let isValid = true

    await Promise.all(
      problem.testCases
        ? problem.testCases.map((testCase) => runCode(code, languageId, testCase.input || '', testCase.output || ''))
        : []
    )
      .then((responses) => {
        responses.forEach((res) => {
          excutionTime += Number(res?.data?.time)

          if (res?.data?.status?.id === 3) {
            correctTestCases += 1
          } else {
            isValid = false
            message = res.data?.status?.description
          }
        })

        if (isValid) {
          message = t('admin.problem.accepted')
        }

        setShowResult(true)
      })
      .finally(() => {
        setResult({
          correctTestCases,
          excutionTime: parseFloat(excutionTime.toFixed(5)),
          message,
          accepted: isValid
        })
        setIsLoading(false)
      })
  }

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const resetCode = () => {
    if (language === 'javascript') {
      setCode(problem.sampleCode?.javascript || javascriptSample)
    } else if (language === 'python') {
      setCode(problem.sampleCode?.python || pythonSample)
    } else if (language === 'java') {
      setCode(problem.sampleCode?.java || javaSample)
    } else if (language === 'c') {
      setCode(problem.sampleCode?.c || cSample)
    } else {
      setCode(problem.sampleCode?.cpp || cppSample)
    }

    setShowResult(false)
  }

  const getLanguageId = (language: string) => {
    const languages: { [key: string]: number } = {
      javascript: 63,
      python: 71,
      java: 62,
      c: 50,
      cpp: 54
    }
    return languages[language] || 63
  }

  useEffect(() => {
    if (language === 'javascript') {
      setCode(problem.sampleCode?.javascript || javascriptSample)
    } else if (language === 'python') {
      setCode(problem.sampleCode?.python || pythonSample)
    } else if (language === 'java') {
      setCode(problem.sampleCode?.java || javaSample)
    } else if (language === 'c') {
      setCode(problem.sampleCode?.c || cSample)
    } else if (language === 'cpp') {
      setCode(problem.sampleCode?.cpp || cppSample)
    }
  }, [language])

  return (
    <>
      {isLoading && <Loading />}

      <div className='flex justify-between items-center pt-[88px]'>
        <Button onClick={() => setProblemIndex((prev) => (prev > 1 ? prev - 1 : 0))} variant='outline'>
          <ArrowLeft />
        </Button>
        <Button
          onClick={() => setProblemIndex((prev) => (prev < problemIds.length - 1 ? prev + 1 : problemIds.length - 1))}
          variant='outline'
        >
          <ArrowRight />
        </Button>
      </div>
      <div className='lg:flex justify-between items-start gap-4 py-2'>
        <div className='lg:w-1/3 w-full bg-white dark:bg-dark-secondary shadow-md rounded-lg p-4 border'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Sparkles className='w-8 h-8' />
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>{problem?.title}</p>
            </div>
            {problem?.difficulty === 'easy' ? (
              <p className='text-sm px-2 py-1 rounded-sm text-green-700 bg-green-300'>
                {t('admin.problem.difficultyEasy')}
              </p>
            ) : problem?.difficulty === 'medium' ? (
              <p className='text-sm px-2 py-1 rounded-sm text-orange-700 bg-orange-300'>
                {t('admin.problem.difficultyMedium')}
              </p>
            ) : (
              <p className='text-sm px-2 py-1 rounded-sm text-red-700 bg-red-300'>
                {t('admin.problem.difficultyHard')}
              </p>
            )}
          </div>
          <Separator className='my-4' />
          <ScrollArea className='h-72 rounded-lg'>
            <p className='text-md font-bold text-gray-900 dark:text-white'>{t('admin.problem.description')}:</p>
            <p className='text-sm text-justify whitespace-pre-wrap text-gray-600 dark:text-gray-400'>
              {problem?.description}
            </p>
          </ScrollArea>
          <div>
            <p className='text-md font-bold text-gray-900 dark:text-white'>{t('admin.problem.sampleInput')}:</p>
            <p className='text-sm text-justify whitespace-pre-wrap text-gray-600 dark:text-gray-400'>
              {problem.testCases?.[0]?.input}
            </p>
          </div>
          <div>
            <p className='text-md font-bold text-gray-900 dark:text-white'>{t('admin.problem.sampleOutput')}:</p>
            <p className='text-sm text-justify whitespace-pre-wrap text-gray-600 dark:text-gray-400'>
              {problem.testCases?.[0]?.output}
            </p>
          </div>
        </div>
        <div className='lg:w-2/3 w-full'>
          <div className='bg-white dark:bg-dark-secondaryr shadow-md rounded-lg p-4 border'>
            <div className='flex justify-between items-center'>
              <Select
                value={language}
                onValueChange={setLanguage}
                defaultValue='javascript'
                disabled={problem?.isSolved}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select a fruit' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    <SelectItem value='javascript'>JavaScript</SelectItem>
                    <SelectItem value='python'>Python</SelectItem>
                    <SelectItem value='java'>Java</SelectItem>
                    <SelectItem value='c'>C</SelectItem>
                    <SelectItem value='cpp'>C++</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className='bg-light-primary dark:bg-dark-primary' variant='outline' onClick={resetCode}>
                <RotateCcw className='w-4 h-4 mr-2' />
                {t('action.reset')}
              </Button>
            </div>
            <Separator className='my-4' />
            <Card className='w-full max-w-4xl p-6 shadow-lg mb-4'>
              <Editor height='360px' language={language} value={code} onChange={handleEditorChange} />
            </Card>
            <div className='flex justify-end'>
              <Button onClick={handleRun} variant='outline'>
                <CodeXml className='w-4 h-4 mr-2' />
                {t('action.runCode')}
              </Button>
              <Button onClick={handleSubmit} className='ml-2' disabled={problem?.isSolved || !result?.accepted}>
                <CheckCheck className='w-4 h-4 mr-2' />
                {t('action.submitCode')}
              </Button>
            </div>
          </div>

          {problem?.isSolved ? (
            <div className='mt-4 bg-white dark:bg-dark-secondary shadow-md rounded-lg p-4 border'>
              <div className='flex items-center text-green-600 text-xl'>
                <CircleCheck className='w-4 h-4 mr-2' />
                {t('admin.problem.correctAnswer')}
              </div>
              <p>{t('admin.problem.challengeSolved')}</p>

              <Separator className='my-4' />
            </div>
          ) : (
            showResult && (
              <div className='mt-4 bg-white dark:bg-dark-secondary shadow-md rounded-lg p-4 border'>
                {result?.accepted ? (
                  <>
                    <div className='flex items-center text-green-600 text-xl'>
                      <CircleCheck className='w-4 h-4 mr-2' />
                      {t('admin.problem.correctAnswer')}
                    </div>
                    <p>{t('admin.problem.correctAnswerDescription')}</p>
                  </>
                ) : (
                  <div className='flex items-center text-red-600 text-xl'>
                    <CircleX className='w-4 h-4 mr-2' />
                    {t('admin.problem.wrongAnswer')}
                  </div>
                )}
                <Separator className='my-4' />
                <p className='text-sm'>
                  {t('admin.problem.correctTestCases')}: {result?.correctTestCases} / {problem?.testCases?.length}
                </p>
                <p className='text-sm'>
                  {t('admin.problem.executionTime')}: {result?.excutionTime} ms
                </p>
                <p className='text-sm'>
                  {t('action.message')}: {result?.message}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}
