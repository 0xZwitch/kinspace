import { LoaderCircle } from 'lucide-react'

export default function Loader({ ...props }) {
  return (
    <span
      className="loading text-center"
      {...props}
    >
      <LoaderCircle className='animate-spin size-5' />
    </span>
  )
}
