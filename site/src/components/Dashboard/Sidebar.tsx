import { UserData } from '@/@types/User'
import { Tabs, useApp } from '@/contexts/App'
import { User, DumbbellIcon, PersonStanding, LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  user?: UserData
}

type Options = {
  name: string
  value: Tabs
  icon: LucideIcon
  route: string
}

export default function SideBar({ user }: Props) {
  const [sideBarOpts, setSideBarOpts] = useState<Options[]>([
    { name: 'Exercicios', value: 'exercises', icon: DumbbellIcon, route: '/admin/dashboard/exercises' },
    { name: 'Músculos', value: 'muscles', icon: PersonStanding, route: '/admin/dashboard/muscles' }
  ])

  const [optionSelected, setOptionSelected] = useState('')
  const { tab, setTab } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    sideBarOpts.forEach((opt) => {
      if(pathname.includes(opt.route) && optionSelected !== opt.value) {
        setOptionSelected(opt.value)
      }
    })
  }, [pathname])

  useEffect(() => {
    setOptionSelected(tab)
  },[tab])

  function handleClickOption(opt: Options) {
    if (optionSelected === opt.value) {
      setOptionSelected('')
      setTab('')
      router.push('/admin/dashboard')
      return
    } 

    setOptionSelected(opt.value)
    setTab(opt.value)
    router.push(opt.route)
  }

  return (
    <div className='h-full w-64  bg-gray-100'>
      <div className='flex flex-row items-center space-x-2 px-2 py-3 h-24'>
        <div className='bg-gray-300 w-10 h-10 rounded-full'></div>
        <span className='text-gray-400 font-medium'>{user?.name}</span>
      </div>

      <div
        className='w-full h-0.5 bg-gray-300'
      />

      <div className='flex items-center'>
        <ul className='flex flex-col space-y-2 w-full'>
          {sideBarOpts.map((opt, idx) => {
            return (
              <li className='list-none w-full' key={idx}>
                <div className='mx-2 mt-2'>
                  <div className={twMerge(
                      'w-full h-full px-3 rounded-xl p-3',
                      (optionSelected === opt.value && 'bg-blue-700')
                    )}>
                    <button
                      className={
                        twMerge(
                          'flex flex-row items-center space-x-2', 
                          (optionSelected === opt.value ? 'text-gray-50 font-medium rounded-xl hover:text-gray-200' : 'text-gray-950 font-normal hover:text-gray-500')
                        )}
                      onClick={() => handleClickOption(opt)}
                    >
                      <opt.icon color={optionSelected === opt.value ? 'white' : 'black'} />
                      <span>{opt.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
