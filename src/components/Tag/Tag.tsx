import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import paths from '@/constants/paths'

interface TagProps {
  tag: string
}

export default function Tag({ tag }: TagProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`${paths.search}?q=${tag}`)
  }

  return (
    <Button onClick={handleClick} variant='outline' size='sm'>
      {tag}
    </Button>
  )
}
