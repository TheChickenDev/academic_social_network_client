import { LoaderPinwheel } from 'lucide-react'

export default function Spinner({ size }: { size: string }) {
  return <LoaderPinwheel size={size} className='animate-spin' />
}
