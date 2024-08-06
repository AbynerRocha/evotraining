import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import Button from '../../../components/Button'
import { Api } from '../../../utils/Api'
import { MotiView, AnimatePresence } from 'moti'
import { useApp } from '../../../contexts/App/AppContext'

type Params = {
  token: string
}

type Fields = {
  password: string
  confirmPassword: string
}

export default function RecoveryPassword() {
  const router = useRouter()
  const { getDeviceId, setTabSelected } = useApp()
  const { token } = useLocalSearchParams<Params>()
  const { control, handleSubmit, getValues, formState: { errors }, setError } = useForm<Fields>()
  const [showingPassword, setShowingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorModal, setErrorModal] = useState({ show: false, reason: '' })
  const [success, setSuccess] = useState(false)

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
        className='absolute top-0 bg-gray-950/50 h-screen w-screen items-center justify-center'
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

  async function validateToken() {
    try {
      Api.post('token/link/r-pass', { token })
    } catch (error: any) {
      if (error.response.data.error) {
        setErrorModal({
          show: true,
          reason: error.response.data.message
        })
      }
    }
  }

  function handleChangePassword(password: string) {
    return new Promise(async (resolve, reject) => {
      Api.put(`/user/recovery-pass/c?np=${password}&atkn=${token}`)
        .then(() => {
          setSuccess(true)
          setTimeout(() => {
            router.replace('/(auth)/login')
          }, 3000)
          resolve(true)
        })
        .catch((err: AxiosError<any>) => {
          setError('root', { message: err.response?.data.message })
          reject()
        })
    })
  }

  function onSubmit(password: string) {
    setIsLoading(true)

    handleChangePassword(password)
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    validateToken()
  }, [])

  return errorModal.show ? <ErrorMessage reason={errorModal.reason} /> : (
    <View className='h-full w-full items-center justify-center space-y-4'>
      <View className='space-y-1 w-[76%] items-start'>
        <Text className='text-gray-950 font-bold text-3xl'>Trocar Senha</Text>
        <Text className='text-gray-500 font-medium text-md'>Digite abaixo a sua nova senha!</Text>
      </View>
      <View className='w-full h-fit items-center'>
        <Controller
          name='password'
          control={control}
          rules={{ required: { value: true, message: 'Este campo é obrigatório!' } }}
          render={({ field: { onBlur, onChange, value } }) => {
            return (
              <View className='w-[76%] items-center space-y-1 mb-5'>
                <View className='w-full items-start'>
                  <Text className='text-gray-600'>Senha</Text>
                </View>
                <View className='w-full h-fit flex-row border-b border-b-blue-700 items-center'>
                  <Input
                    className=' w-[85%] p-2'
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholderTextColor='rgb(190 190 190)'
                    placeholder='Digite aqui'
                    secureTextEntry={!showingPassword}
                    autoComplete='new-password'
                  />
                  <Pressable className='p-2 items-center justify-center' onPress={() => setShowingPassword((v) => !v)}>
                    <Ionicons className='w-full h-full' name={showingPassword ? 'eye-off' : 'eye'} color='black' size={24} />
                  </Pressable>
                </View>
                <View className='w-full items-start'>
                  {errors.password && <Text className='text-sm text-red-600'>{errors.password.message}</Text>}
                </View>
              </View>
            )
          }}
        />
        <Controller
          name='confirmPassword'
          control={control}
          rules={
            {
              required: {
                value: true,
                message: 'Este campo é obrigatório!'
              },
              validate: {
                confirm: (value, formValues) => value === formValues.password ? true : 'As senhas não coincidem'
              }
            }
          }
          render={({ field: { value, onBlur, onChange } }) => {
            return <>
              <View className='w-[76%] items-center space-y-1 mb-2'>
                <View className='w-full items-start '>
                  <Text className='text-gray-600'>Confirme a senha</Text>
                </View>
                <View className='w-full h-fit flex-row border-b border-b-blue-700 items-center'>
                  <Input
                    className=' w-[85%] p-2'
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholderTextColor='rgb(190 190 190)'
                    placeholder='Digite aqui'
                    secureTextEntry={!showingPassword}
                  />
                  <Pressable className='p-2 items-center justify-center' onPress={() => setShowingPassword((v) => !v)}>
                    <Ionicons className='w-full h-full' name={showingPassword ? 'eye-off' : 'eye'} color='black' size={24} />
                  </Pressable>
                </View>
                <View className='w-full items-start'>
                  {errors.confirmPassword && <Text className='text-sm text-red-600'>{errors.confirmPassword.message}</Text>}
                </View>
              </View>
            </>
          }}
        />

        <View className='mt-2'>
          <Button
            isLoading={isLoading}
            disabled={success}
            onPress={() => {
              const { password }  = getValues()

              onSubmit(password)
            }}
          >
            Confirmar
          </Button>
        </View>
        {errors.root && (
          <MotiView
            from={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 600
            }}

            className='w-[70%] flex-row items-center space-x-3 h-fit break-words p-3 rounded-lg border border-red-500 bg-red-600 mt-5'
          >
            <MaterialIcons name="error-outline" size={24} color="white" />
            <Text className='text-sm text-gray-50 font-semibold mr-6'>{errors.root.message}</Text>
          </MotiView>
        )}
        {success && (
          <MotiView
            from={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 600
            }}

            className='w-[70%] flex-row items-center space-x-3 h-fit break-words p-3 rounded-lg border border-green-600 bg-green-600 mt-5'
          >
            <MaterialIcons name="check" size={24} color="white" />
            <Text className='text-sm text-gray-50 font-semibold mr-6'>
              Sua senha foi trocada com sucesso!
              Iremos te redirecionar para o inicio em 3 segundos!
            </Text>
          </MotiView>
        )}
      </View>
    </View>
  )
}