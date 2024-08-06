import { View, Text, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Pressable, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { twMerge } from 'tailwind-merge'
import Button from '../../components/Button'
import validator from 'validator'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { AxiosError } from 'axios'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MotiText, MotiView, useDynamicAnimation } from 'moti'


type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const { control, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<Inputs>({ defaultValues: { email: '', password: '' } })
  const [showingKeyboard, setShowingKeyboard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showingPassword, setShowingPassword] = useState(false)

  const { signIn, user } = useAuth()

  const titleAnim = useDynamicAnimation(() => ({
    scale: 1
  }))
  const router = useRouter()

  useEffect(() => {
    if (user !== null) {
      router.replace('/')
      return
    }

    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => handleKeyboard('show'))
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => handleKeyboard('hide'));
  }, [])

  function handleKeyboard(state: 'show' | 'hide') {
    if (state === 'show') {
      setShowingKeyboard(true)
    } else {
      setShowingKeyboard(false)
      titleAnim.animateTo((current) => ({ 
        ...current, 
        scale: [
          { value: 1, rubberBandEffect: false, rubberBandFactor: 0  }
        ], 
        marginLeft: [
          {value: 0, rubberBandEffect: false, rubberBandFactor: 0 }
        ] 
      }))
    }
  }

  function validateData({ email, password }: Inputs) {
    return new Promise((resolve, reject) => {
      if (!validator.isEmail(email)) {
        reject({ name: 'email', message: 'O email inserido não é válido.' })
        return
      }

      signIn(email, password)
        .then(() => {
          router.replace('/')

          clearErrors()
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

  function onSubmit({ email, password }: Inputs) {
    clearErrors()
    setIsLoading(true)

    validateData({ email, password }).finally(() => setIsLoading(false))
  }

  return (
    <KeyboardAvoidingView className='flex-1 bg-gray-50' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className={twMerge('h-screen w-screen bg-gray-50 space-y-5 items-center', (!showingKeyboard ? ' justify-center' : 'pt-10'))}>
        <View className='w-[76%]'>
          <View 
            className='w-full space-y-1'
            // transition={{ type: 'timing' }}
            // state={titleAnim} 
          >
            <Text 
              className='text-gray-950 font-bold text-4xl'
            >
              Login
            </Text>
            <View className='w-[76%]'>
              <Text className='text-gray-400 font-medium font-lg'>Insira os seus dados abaixo para ter acesso a aplicação</Text>
            </View>
          </View>
        </View>
        <View className='h-[2px] w-[80%] bg-gray-200' />
        <View className='w-full items-center'>
          <Controller
            name='email'
            control={control}
            rules={{ required: { value: true, message: 'Este campo é obrigatório!' } }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (<View className='w-[76%] items-center space-y-2 mb-5'>
                <View className='w-full items-start '>
                  <Text className='text-gray-600'>Email</Text>
                </View>
                <Input
                  className='border-b border-b-blue-700 w-full p-2'
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholderTextColor='rgb(190 190 190)'
                  placeholder='Digite aqui'
                  keyboardType='email-address'
                  autoComplete='email'
                />
                <View className='w-full items-start'>
                  {errors.email && <Text className='text-sm text-red-600'>{errors.email.message}</Text>}
                </View>

              </View>
              )
            }}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: { value: true, message: 'Este campo é obrigatório!' } }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (<View className='w-[76%] items-center space-y-1 mb-5'>
                <View className='w-full items-start '>
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
          <View className='w-[76%] items-end mb-5'>
            <Link href='/(auth)/recoverypass' className='font-sm text-blue-900 text-right'>Esqueceu a sua senha?</Link>
          </View>
          <View className='w-full items-center'>
            <Button
              color='blue'
              textSize='lg'
              onPress={handleSubmit((data) => onSubmit(data))}
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </View>

          {errors.root && (
            <View

              className='w-[70%] flex-row items-center space-x-3 h-fit break-words p-3 rounded-lg border border-red-500 bg-red-600 mt-5'
            >
              <MaterialIcons name="error-outline" size={24} color="white" />
              <Text className='text-sm text-gray-50 font-semibold mr-6'>{errors.root.message}</Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}