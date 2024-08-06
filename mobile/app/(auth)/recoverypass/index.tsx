import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { MaterialIcons, Feather } from '@expo/vector-icons';
import isEmail from 'validator/lib/isEmail'
import { Api } from '../../../utils/Api'
import { MotiView } from 'moti'
import Constants from 'expo-constants'
import { useApp } from '../../../contexts/App/AppContext'

type Fields = {
  email: string
}

export default function RecoveryPassword() {
  const { control, formState: { errors }, setError, getValues ,handleSubmit } = useForm<Fields>()
  const { getDeviceId } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sendedEmail, setSendedEmail] = useState('')
  const [disabledBtn, setDisabledBtn] = useState(false)
  const [timeToResend, setTimeToResend] = useState(30)

  useEffect(() => {
    if(disabledBtn === false) return 
    var time = timeToResend
    
    const timer = setInterval(() => {
      if(time === 0) {
        clearInterval(timer)
        setDisabledBtn(false)
      } 
      
      time = time - 1
      setTimeToResend(time)
    }, 1000)

  }, [disabledBtn])

  function handleRequest(email: string) {
    return new Promise(async (resolve, reject) => {
      const deviceId = await getDeviceId()

      Api.post('user/auth/request-changepassword', { email }, { 
        headers: {
          'device-id': deviceId
        }
      })
        .then((res) => {
          setDisabledBtn(true)

          if(success === true && sendedEmail !== '') return 

          setSendedEmail(email)
          setSuccess(true)
          resolve(true)
        })
        .catch((err) => {
          
          switch (err.response?.data.error) {
            case 'MISSING_DATA':
              setError('root', { message: err.response?.data.message })

            case 'USER_NOT_FOUND':
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

    handleRequest(data.email)
      .finally(() => setIsLoading(false))
  }

  function SuccessMessage() {
    return <View className='w-screen h-screen items-center justify-center px-5 space-y-4'>
        <View className='w-48 h-48 rounded-full border-[10px] border-blue-800 items-center justify-center'>
          <MaterialIcons name='mail' size={100} color='rgb(30 64 175)' />
          <View className='absolute top-[86px] left-[92px]'>
            <View>
            <Feather name="check-circle" size={30} color="white" />
            </View>
            
          </View>
        </View>
        <Text className='text-[19px] text-center'>O seu pedido de recuperação foi enviado para o email <Text className='font-semibold'>{sendedEmail}</Text> com sucesso!</Text>
        <Button 
          disabled={disabledBtn}
          onPress={() => {
            
            setTimeToResend(60)
            handleRequest(sendedEmail)
          }}
        >
          {disabledBtn 
          ? timeToResend + ' segundos'
          : 'Reenviar'
          }
        </Button>
    </View>
  }

  return success ? <SuccessMessage/> :(
    <KeyboardAvoidingView className='flex-1 bg-gray-50' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className='w-screen h-screen items-center justify-center space-y-6'>
        <View className='w-[76%] h-fit'>
          <Text className='text-3xl font-bold'>Recupere a sua senha</Text>
          <Text className='text-md text-gray-500'>Insira abaixo o seu email da conta que você deseja recuperar</Text>
        </View>

        <View className='h-fit w-full items-center'>
          <Controller
            name='email'
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Este campo é obrigatório!'
              },
              validate: {
                isValidEmail: (value) => isEmail(value) ? true : 'Este email não é válido.'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (<View className='w-[76%] items-center space-y-2 mb-5'>
                <View className='w-full items-start '>
                  <Text className='text-gray-600'>Email</Text>
                </View>
                <Input
                  autoFocus
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

          <Button
            isLoading={isLoading}
            onPress={handleSubmit((data) => onSubmit(data))}
          >
            Enviar
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
  )
}