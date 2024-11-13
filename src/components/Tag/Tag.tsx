import { Button } from '../ui/button'
import { Tag as TagObject } from '@/types/post.type'

interface TagProps {
  tag: TagObject
}

export default function Tag({ tag }: TagProps) {
  return (
    <Button variant='outline' size='sm'>
      {tag.label}
    </Button>
  )
}
