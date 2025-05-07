import { getProblems } from '@/apis/problem.api'
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
import { ContestProblem } from '@/types/contest.type'
import { Editor } from '@monaco-editor/react'
import { CheckCheck, CodeXml, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export default function Contest() {
  const { t } = useTranslation()
  const [code, setCode] = useState(
    `function add(a, b) {\n// enter your code here\n}\n\nconst input = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nfor (let i = 0; i < input.length; i++) {\nconst [a, b] = input[i].split(' ').map(Number);\nconsole.log(add(a, b));\n}`
  )
  const { id: problemId } = useParams()
  const [language, setLanguage] = useState<string>('javascript')
  const [problem, setProblem] = useState<ContestProblem>({} as ContestProblem)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getProblems({ problemId })
      .then((res) => {
        const problem = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
        console.log('Problem:', problem)
        setProblem(problem)
      })
      .catch((err) => {
        console.error('Error fetching problem:', err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [problemId])

  const handleSubmit = () => {
    console.log('Code submitted:', code)
  }

  const handleEditorChange = (value) => {
    console.log('Editor value:', value)
    setCode(value)
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

  return (
    <>
      <Helmet>
        <title>{t('pages.home')}</title>
      </Helmet>
      {isLoading && <Loading />}
      <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-light-primary dark:bg-dark-primary'>
        <div className='lg:flex justify-between items-start gap-4 py-28'>
          <div className='lg:w-1/3 w-full bg-white dark:bg-dark-secondary shadow-md rounded-md p-4'>
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
            <ScrollArea className='h-72 rounded-md'>
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
          <div className='lg:w-2/3 w-full bg-white dark:bg-dark-secondary shadow-md rounded-md p-4'>
            <div className='flex justify-between items-center'>
              <Select value={language} onValueChange={setLanguage} defaultValue='javascript'>
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
              <Button className='bg-light-primary dark:bg-dark-primary' variant='outline'>
                <RotateCcw className='w-4 h-4 mr-2' />
                {t('action.reset')}
              </Button>
            </div>
            <Separator className='my-4' />

            <Card className='w-full max-w-4xl p-6 shadow-lg mb-4'>
              <Editor height='360px' language={language} defaultValue={code} onChange={handleEditorChange} />
            </Card>
            <div className='float-right'>
              <Button onClick={handleSubmit} variant='outline'>
                <CodeXml className='w-4 h-4 mr-2' />
                {t('action.runCode')}
              </Button>
              <Button onClick={handleSubmit} className='ml-2'>
                <CheckCheck className='w-4 h-4 mr-2' />
                {t('action.submitCode')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
