'use client'

import { UserData } from '@/@types/User'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { CookieKeys } from '@/utils/cookies/keys'
import { useCookies } from 'next-client-cookies'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { XCircle } from 'lucide-react'
import { useAuth } from '@/contexts/Auth'
import ReactLoading  from 'react-loading'
import Logo from '@/components/Logo'

type Fields = {
  email: string
  password: string
}

type Response = {
  user: UserData
  authToken: string
  refreshToken: string
}

const adminLevel = 2

export default function Login() {
  const { handleSubmit, register, formState: { errors }, setError } = useForm<Fields>({})
  const [isLoading, setIsLoading] = useState(false)

  const cookies = useCookies()
  const router = useRouter()
  const { signIn, isLogged } = useAuth()

  useEffect(() => {
    verifySession()
  }, [])

  async function verifySession() {
    const logged = await isLogged()

    if(logged) {
      router.replace('/admin/dashboard')
      return
    }
  }

  function handleLogin({ email, password }: Fields) {
    return new Promise((resolve, reject) => {
      signIn({ email, password })
        .then((res) => {
          const { user, authToken, refreshToken } = res.data

          if (user.accessLevel !== adminLevel) {
            setError('root', { message: 'Esta conta não tem acesso a este painel.' })
            reject()
            return
          }

          const authTokenExpires = new Date().setHours(new Date().getHours() + 1) // 1 hour
          cookies.set(CookieKeys.COOKIE_AUTH_TOKEN, authToken, { expires: authTokenExpires })

          const refreshTokenExpires = new Date().setHours(new Date().getDay() + 1) // 1 day
          cookies.set(CookieKeys.COOKIE_REFRESH_TOKEN, authToken, { expires: refreshTokenExpires })

          router.replace('/admin/dashboard')
          resolve(true)

        })
        .catch((err: AxiosError<any>) => {
          
          switch (err.response?.data.error) {
            case 'MISSING_DATA':
              setError('root', { message: err.response?.data.message })

            case 'USER_NOT_FOUND':
              setError('email', { message: err.response?.data.message }, { shouldFocus: true })
              break
            case 'WRONG_PASSWORD':
              setError('password', { message: err.response?.data.message }, { shouldFocus: true })
              break
            default:
              setError('root', { message: 'Houve um erro desconhecido. Tente novamente mais tarde.' })
              break
          }

          reject()
        })
    })

  }

  function onSubmit(data: Fields) {
    setIsLoading(true)

    handleLogin(data)
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className='flex items-center justify-center h-screen w-screen bg-gray-900'>
      <div className='bg-gray-50 rounded-lg w-[26rem] h-[26rem] p-3'>
        <form className='flex flex-1 items-center justify-center flex-col w-full h-full space-y-3'>
          <Logo />
          <div className='flex flex-col w-64 space-y-2'>
            <label htmlFor="">Email</label>
            <input
              {...register('email', {
                required: { value: true, message: 'Este campo é obrigatório.' },
                validate: {
                  isEmail: (value) => isEmail(value) ? true : 'Insira um email válido.'
                }
              })}
              className='bg-gray-100 border border-gray-400 h-12 w-full p-3 rounded-lg placeholder:text-sm focus:outline-none'
              placeholder='Digite aqui'
            />
            {errors.email && <span className='text-sm text-red-500 '>{errors.email.message}</span>}
          </div>
          <div className='flex flex-col w-64 space-y-2'>
            <label htmlFor="">Senha</label>
            <input
              {...register('password', { required: { value: true, message: 'Este campo é obrigatório.' } })}
              type='password'
              className='bg-gray-100 border border-gray-400 h-12 w-full p-3 rounded-lg placeholder:text-sm focus:outline-none'
              placeholder='Digite aqui'
            />
            {errors.password && <span className='text-sm text-red-500 '>{errors.password.message}</span>}
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className='bg-blue-800 rounded-lg w-[50%] flex items-center justify-center text-center h-10 text-gray-50 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-950 disabled:text-gray-300'
          >
            {isLoading ? <ReactLoading type='spin' height={23} width={23} color='white' /> : 'Entrar' }
          </button>
          {errors.root && (
            <div
              className='bg-red-500 p-3 space-x-2 rounded-lg h-fit w-[20rem] text-gray-50 flex flex-row items-center justify-center break-words'
            >
              <XCircle size={25} color='white' />
              <span>
                {errors.root.message}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
