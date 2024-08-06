'use client'

import { UserData } from '@/@types/User'
import SideBar from '@/components/Dashboard/Sidebar'
import Logo from '@/components/Logo'
import { CookieKeys } from '@/utils/cookies/keys'
import { LocalStorageKeys } from '@/utils/localStorage/keys'
import { useCookies } from 'next-client-cookies'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<UserData>()

  const cookies = useCookies()

  useEffect(() => {
    const data = localStorage.getItem(LocalStorageKeys.USER)
    const refreshToken = cookies.get(CookieKeys.COOKIE_REFRESH_TOKEN)

    if (data === null || !refreshToken) {
      router.replace('/admin/login')
      return
    }

    setUser(JSON.parse(data))
  }, [])

  return (

    <div className='flex flex-row h-screen w-screen bg-gray-100'>
      <div className='flex flex-col flex-1'>
        <Logo />
        <SideBar user={user} />
      </div>

      <div className='h-full w-full flex-col p-5 space-y-2'>
        <div className=''>
          <h1 className='font-semibold text-gray-950 text-2xl'>Olá {user?.name}</h1>
        </div>
        <div className='h-full w-full bg-gray-50 rounded-lg p-4'>
          {children}
        </div>
      </div>
    </div>
  )
}
