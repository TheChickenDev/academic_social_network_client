import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

const questions = [
  {
    id: 1,
    question: 'How to use React hooks?',
    likes: 10,
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s',
    tags: ['reactjs', 'javascript'],
    user: 'John Doe',
    date: '2023-10-01',
    answers: 5
  },
  {
    id: 2,
    question:
      'What is the best way to learn JavaScript? What is the best way to learn JavaScript? What is the best way to learn JavaScript?',
    likes: 20,
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s',
    tags: ['reactjs', 'javascript'],
    user: 'Jane Smith',
    date: '2023-10-02',
    answers: 8
  },
  {
    id: 3,
    question: 'How to use React hooks?',
    likes: 10,
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s',
    tags: ['reactjs', 'javascript'],
    user: 'John Doe',
    date: '2023-10-01',
    answers: 5
  },
  {
    id: 4,
    question: 'What is the best way to learn JavaScript?',
    likes: 20,
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s',
    tags: ['reactjs', 'javascript'],
    user: 'Jane Smith',
    date: '2023-10-02',
    answers: 8
  }
]

export default function TodayQuestions() {
  const { t } = useTranslation()

  return (
    <div className='mt-4 p-2 text-sm border border-gray-300 outline-none rounded-md bg-white dark:bg-background-dark'>
      <h2 className='text-xl font-semibold'>{t('today-questions')}</h2>
      <div>
        {questions.map((q, index) => (
          <div
            key={q.id}
            className={classNames('w-full py-4', {
              'border-b': index !== questions.length - 1
            })}
          >
            <div className='flex'>
              <span className='text-sm text-orange-500 min-w-fit max-h-fit bg-orange-100 border border-orange-200 rounded-sm p-1'>
                <span className='-ml-1'>🔥</span>
                <span className='font-bold'>{q.likes}</span>
              </span>
              <span className='ml-1 text-lg text-gray-600 dark:text-white line-clamp-2 font-medium'>{q.question}</span>
            </div>
            <div className='mt-2 flex flex-wrap gap-2'>
              {q.tags.map((tag, index) => (
                <span
                  key={index}
                  className='inline-block bg-gray-100 rounded-sm text-md font-medium mr-2 px-3 py-1 dark:bg-blue-900'
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className='mt-2 flex items-center justify-start gap-1'>
              <Avatar>
                <AvatarImage src={q.avatar} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <p className='font-bold text-sm'>{q.user}</p>
              <svg width='12' height='12' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M5 6.475L6.3875 7.525C6.4875 7.59167 6.5875 7.59375 6.6875 7.53125C6.7875 7.46875 6.81667 7.37917 6.775 7.2625L6.25 5.525L7.6125 4.55C7.7125 4.475 7.74167 4.38125 7.7 4.26875C7.65833 4.15625 7.57917 4.1 7.4625 4.1H5.8L5.2375 2.275C5.19583 2.15833 5.11667 2.1 5 2.1C4.88333 2.1 4.80417 2.15833 4.7625 2.275L4.2 4.1H2.5375C2.42083 4.1 2.34167 4.15625 2.3 4.26875C2.25833 4.38125 2.2875 4.475 2.3875 4.55L3.75 5.525L3.225 7.2625C3.18333 7.37917 3.2125 7.46875 3.3125 7.53125C3.4125 7.59375 3.5125 7.59167 3.6125 7.525L5 6.475ZM5 10C4.30833 10 3.65833 9.86875 3.05 9.60625C2.44167 9.34375 1.9125 8.9875 1.4625 8.5375C1.0125 8.0875 0.65625 7.55833 0.39375 6.95C0.13125 6.34167 0 5.69167 0 5C0 4.30833 0.13125 3.65833 0.39375 3.05C0.65625 2.44167 1.0125 1.9125 1.4625 1.4625C1.9125 1.0125 2.44167 0.65625 3.05 0.39375C3.65833 0.13125 4.30833 0 5 0C5.69167 0 6.34167 0.13125 6.95 0.39375C7.55833 0.65625 8.0875 1.0125 8.5375 1.4625C8.9875 1.9125 9.34375 2.44167 9.60625 3.05C9.86875 3.65833 10 4.30833 10 5C10 5.69167 9.86875 6.34167 9.60625 6.95C9.34375 7.55833 8.9875 8.0875 8.5375 8.5375C8.0875 8.9875 7.55833 9.34375 6.95 9.60625C6.34167 9.86875 5.69167 10 5 10Z'
                  fill='#FBBF24'
                />
              </svg>
            </div>
            <div className='mt-2 flex justify-between text-xs'>
              <span>{t('asked-at') + ` ${q.date}`}</span>
              <span>{`${q.answers} ` + t('answers')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
