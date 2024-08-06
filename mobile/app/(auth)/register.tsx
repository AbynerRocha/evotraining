import { View, Text, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { twMerge } from 'tailwind-merge'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Button from '../../components/Button'
import { AnimatePresence, MotiView } from 'moti'
import axios, { AxiosError } from 'axios'
import { UserData } from '../../@types/User'
import isEmail from 'validator/lib/isEmail'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useRouter } from 'expo-router'
import { Api } from '../../utils/Api'

type Fields = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const { control, formState: { errors }, setError, handleSubmit, getValues } = useForm<Fields>()
  const [genderSelected, setGenderSelected] = useState<'man' | 'woman' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showingPassword, setShowingPassword] = useState(false)
  const [showingKeyboard, setShowingKeyboard] = useState(false)

  const { signIn } = useAuth()

  const router = useRouter()

  function handleValidateData(data: Fields) {
    return new Promise(async (resolve, reject) => {
      if (!isEmail(data.email)) {
        setError('email', { message: 'Este email não é valido!' })
        reject()
        return
      }

      if (genderSelected === null) {
        setError('root', { message: 'Um género precisa ser selecionado!' })
        reject()
        return
      }

      type Response = {
        user: UserData,
        refreshToken: string
        authToken: string
      }

      Api.post<Response>('user/auth/register', { name: data.name.trimStart().trimEnd(), email: data.email.trim(), password: data.password.trim() })
        .then((req) => req.data)
        .then(() => {
          signIn(data.email, data.password)
            .then(() => {
              router.replace('/')
              resolve(true)
            })
            .catch((err) => { throw err })
        })
        .catch((err: AxiosError<{ error: string, message: string }>) => {
          
          switch (err.response?.data.error) {
            case 'MISSING_DATA':
              setError('root', { message: err.response?.data.message })

            case 'THIS_USER_ALREADY_EXISTS':
              setError('email', { message: err.response?.data.message }, { shouldFocus: true })
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

    handleValidateData(data)
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {

    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => handleKeyboard('show'))
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => handleKeyboard('hide'));
  }, [])

  function handleKeyboard(state: 'show' | 'hide') {
    if (state === 'show') {
      setShowingKeyboard(true)
    } else {
      setShowingKeyboard(false)
    }
  }

  return (
    <MotiView
      className='h-screen w-screen items-center mt-10'
      from={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        duration: 600
      }}
    >
      <AnimatePresence exitBeforeEnter>
        {!showingKeyboard && <MotiView
          className='mb-7'
          from={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 400,

          }}
        >
          <Text className='text-2xl'>Bem vindo ao</Text>
          <View className='flex-row items-center'>
            <View className='bg-blue-800 py-1 px-3 w-fit rounded-xl'>
              <Text className='text-gray-50 text-2xl font-bold italic'>Evo</Text>
            </View>
            <Text className='text-blue-950 font-bold italic text-2xl'>Training</Text>
          </View>
        </MotiView>}
      </AnimatePresence>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={'h-full w-full items-center ' + (showingKeyboard && 'mt-10')}
      >

        <View
          className='w-full items-center justify-center'
        >
          <Controller
            name='name'
            control={control}
            rules={{ required: { value: true, message: 'Este campo é obrigatório!' } }}
            render={({ field: { value, onBlur, onChange } }) => {
              return <View className='w-[76%] items-center space-y-1 mb-5'>
                <View className='w-full items-start '>
                  <Text className='text-gray-600'>Seu nome</Text>
                </View>
                <Input
                  className='border-b border-b-blue-700 w-full p-2'
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholderTextColor='rgb(190 190 190)'
                  placeholder='Digite aqui'
                />
                <View className='w-full items-start'>
                  {errors.name && <Text className='text-sm text-red-600'>{errors.name.message}</Text>}
                </View>
              </View>
            }}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: { value: true, message: 'Este campo é obrigatório!' } }}
            render={({ field: { value, onBlur, onChange } }) => {
              return <View className='w-[76%] items-center space-y-1 mb-5'>
                <View className='w-full items-start '>
                  <Text className='text-gray-600'>Seu email</Text>
                </View>
                <Input
                  className='border-b border-b-blue-700 w-full p-2'
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholderTextColor='rgb(190 190 190)'
                  placeholder='Digite aqui'
                  keyboardType='email-address'
                />
                <View className='w-full items-start'>
                  {errors.email && <Text className='text-sm text-red-600'>{errors.email.message}</Text>}
                </View>
              </View>
            }}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: { value: true, message: 'Este campo é obrigatório!' } }}
            render={({ field: { value, onBlur, onChange } }) => {
              return <View className='w-[76%] items-center space-y-1 mb-5'>
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
          <View className='space-y-2 mb-5'>
            <Text className='text-gray-600'>Seu género</Text>

            <View className='flex-row space-x-3'>
              <Pressable
                onPress={() => setGenderSelected((value) => value === 'man' ? null : 'man')}
                className={twMerge(
                  'border border-blue-700 p-3 rounded-xl w-16 h-16 items-center justify-center',
                  (genderSelected === 'man' && 'bg-blue-700 transition-all duration-300 ease-linear')
                )}
              >
                <Ionicons name="man" size={30} color={genderSelected === 'man' ? 'white' : 'black'} />
              </Pressable>
              <Pressable
                onPress={() => setGenderSelected((value) => value === 'woman' ? null : 'woman')}
                className={twMerge(
                  'border border-pink-400 p-3 rounded-xl w-16 h-16 items-center justify-center',
                  (genderSelected === 'woman' && 'bg-pink-400 transition-all duration-300 ease-linear')
                )}>
                <Ionicons name="woman" size={30} color={genderSelected === 'woman' ? 'white' : 'black'} />
              </Pressable>
            </View>
          </View>

          <View className='mb-4'>
            <Button
              size='md'
              textSize='sm'
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              Criar Conta
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
        </View>
      </KeyboardAvoidingView>
    </MotiView>
  )
}