import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Tag as TagObject } from '@/types/post.type'
import paths from '@/constants/paths'

interface TagProps {
  tag: TagObject
}

export default function Tag({ tag }: TagProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`${paths.search}?q=${tag.label}`)
  }

  return (
    <Button onClick={handleClick} variant='outline' size='sm'>
      {tag.label}
    </Button>
  )
}
