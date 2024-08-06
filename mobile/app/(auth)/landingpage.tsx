import { View, Text, Image, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Link, useRouter } from 'expo-router'
import bgImage from '../../assets/loginImage.png'
import Button from '../../components/Button'

export default function Login() {
  const router = useRouter()
  const { signIn, user } = useAuth()

  useEffect(() => {
    if (user !== null) {
      router.replace('/')
      return
    }
  }, [])

  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height

  return (
    <View className='w-screen h-screen'>
      <Image
        className='w-screen h-screen object-fill pb-4'
        source={bgImage}
        width={screenWidth}
        height={screenHeight}
      />
      <View className='flex-row items-center absolute top-0 p-3 w-full'>
        <View className='bg-gray-50 flex-row items-center p-2 rounded-xl w-fit'>

          <View className='bg-blue-800 py-1 px-3 w-fit rounded-xl'>
            <Text className='text-gray-50 text-2xl font-bold italic'>Evo</Text>
          </View>
          <Text className='text-gray-950 font-bold italic text-2xl'>Training</Text>
        </View>
      </View>
      <View className='h-32 w-full bottom-0 absolute bg-gray-100 rounded-t-2xl items-center justify-center space-y-3'>
        <View className='absolute -top-12'>
          <Text className='font-semibold text-xl text-gray-50 italic'>Aumente e Organize a sua Evolução</Text>
        </View>
        <Button
          className='bg-blue-800 rounded-lg w-[60%] h-11 flex-row items-center justify-center'
        >
          <Link
            href='/(auth)/register'
            className='text-gray-50 font-semibold'
          >
            Criar uma conta
          </Link>
        </Button>
        <View className='flex-row space-x-1'>
          <Text className='text-gray-950'>Já tem uma conta?</Text>
          <Link href='/(auth)/login' className='font-medium text-blue-800'>Entre aqui</Link>
        </View>
      </View>
    </View>
  )
}