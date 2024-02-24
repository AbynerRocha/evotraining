import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex h-screen w-screen bg-gray-50 items-center justify-center'>
      <Link
        className='text-gray-950 bg-blue-800 rounded-lg p-3 no-underline'
        href='/admin/login'
      >Painel admin</Link>
    </main>
  )
}
