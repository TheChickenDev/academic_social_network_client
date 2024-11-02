import Post from '@/components/Post'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '@/apis/post.api'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Posts() {
  const [page, setPage] = useState<number>(1)
  const { isLoading, data } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => getPosts({ page, limit: 10 })
  })

  return (
    <div className='space-y-4'>
      {isLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='w-full h-24 rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
          </div>
        </div>
      ) : (
        data?.data?.data.map((item) => <Post key={item._id} post={item} />)
      )}
    </div>
  )
}
