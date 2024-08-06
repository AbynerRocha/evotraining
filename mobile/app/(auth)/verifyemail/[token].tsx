import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { AxiosError } from 'axios'
import { Feather } from '@expo/vector-icons';
import Button from '../../../components/Button'
import { Api } from '../../../utils/Api'
import { AnimatePresence, MotiView } from 'moti'
import { useAuth } from '../../../contexts/Auth/AuthContext';

type Params = {
  token: string
}

type Fields = {
  password: string
  confirmPassword: string
}

export default function RecoveryPassword() {
  const { setUser, user } = useAuth()
  const { token } = useLocalSearchParams<Params>()
  const router = useRouter()

  if(!user || user === null) {
    router.replace('/(auth)/landingpage')
    return
  }

  const [success, setSuccess] = useState<boolean | undefined>()
  const [reason, setReason] = useState('')

  async function validateToken() {
    try {
      const res = await Api.post('token/link/v-email', { token })
      const data = res.data

      handleVerifyEmail(data) 
      .then(() => setSuccess(true))
      .catch((err) => {
        setSuccess(false)
        
        const errReason = err.response.data.message
        if(!errReason) return setReason('Token expirado') 

        setReason(errReason)
        
        setUser({ ...user!, verified: true })
      })
    } catch (error: any) {
        if(error.response.data.error) {
            setSuccess(false)
        } 
    }
  }

  function handleVerifyEmail({ code, userId }: { code: string, userId: string }) {
    return new Promise((resolve, reject) => {
      Api.post(`/user/auth/verify-email`, { code, userId }, { headers: { Authorization: token }})
      .then(() => {

        resolve(true)
      })
      .catch((err: AxiosError<any>) => {
    
        reject(err)
      })
    })
  }

  useEffect(() => {
    validateToken()
  }, [])

  function ErrorMessage({ reason }: { reason: string }) {
    return <AnimatePresence exitBeforeEnter>
      <MotiView
        from={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 500
        }}
        className='absolute top-0 mt-1 bg-gray-950/50 h-screen w-screen items-center justify-center'
      >
        <MotiView
          from={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1200,
          }}
          className='bg-gray-50 rounded-lg h-80 w-72 p-4 justify-center items-center space-y-4'
        >
          <Feather name="x-circle" size={100} color='rgb(30 64 175)' />
          <View>
            <Text className='font-medium text-center'>Infelizmente não foi possivel realizar esta ação neste momento.</Text>
            <Text className='font-medium text-center'>Motivo: {reason}</Text>
          </View>
          <Button onPress={() => router.replace('/')}>Voltar</Button>
        </MotiView>
      </MotiView>
    </AnimatePresence>
  }

  function SuccessMessage() {
    useEffect(() => {
      setTimeout(() => {
        router.replace('/')
      }, 5000)
    }, [])

    return <AnimatePresence exitBeforeEnter>
      <MotiView
        from={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 500
        }}
        className='absolute top-0 mt-1 bg-gray-950/50 h-screen w-screen items-center justify-center'
      >
        <MotiView
          from={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1200,
          }}
          className='bg-gray-50 rounded-lg h-80 w-72 p-4 justify-center items-center space-y-4'
        >
          <Feather name="check-circle" size={100} color='rgb(30 64 175)' />
          <View>
            <Text className='font-medium text-center'>O seu email foi verificado com sucesso.</Text>
            <Text className='font-light text-center'>caso você não seja redirecionado em 5 segundos, clique abaixo</Text>
          </View>
          <Button onPress={() => router.replace('/')}>Voltar</Button>
        </MotiView>
      </MotiView>
    </AnimatePresence> 
  }

  return success ? <SuccessMessage /> : <ErrorMessage reason={reason} />
}