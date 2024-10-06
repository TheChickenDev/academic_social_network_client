import Search from './components/Search'
import PopularTags from './components/PopularTags'
import TodayQuestions from './components/TodayQuestions'
import Posts from './components/Posts'
import Introduction from './components/Introduction'

export default function Home() {
  return (
    <div className='container h-fit mx-auto px-2 md:px-6 lg:px-12 bg-background-light dark:bg-black'>
      <div className='flex justify-between items-start gap-4 py-28'>
        <div className='flex-initial w-1/4'>
          <Search />
          <PopularTags />
          <TodayQuestions />
        </div>
        <div className='flex-initial w-1/2'>
          <Posts />
        </div>
        <div className='flex-initial w-1/4'>
          <Introduction />
        </div>
      </div>
    </div>
  )
}
