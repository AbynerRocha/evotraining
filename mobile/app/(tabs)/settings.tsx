import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Link, useRouter } from 'expo-router'
import { useApp } from '../../contexts/App/AppContext'

export default function Settings() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const { tab, setTabSelected } = useApp()

  useEffect(() => {
    if(tab !== 'settings') setTabSelected({ 
      key: 'settings',
      route: '/(tabs)/settings'
    })
  }, [])

  const options = [
    { name: 'Histórico de Treinos', route: '/settings/history', icon: <FontAwesome5 name='history' size={20} color='gray' />  },
    { name: 'Planos de Treino', route: '/settings/training-plans', icon: <FontAwesome5 name="dumbbell" size={18} color="gray" /> }
  ]

  return (
    <View className='w-full h-full '>
      <View className='mb-2 mx-5'>
        <Text className='text-3xl font-bold'>Definições</Text>
      </View>
      <View className='h-0.5 w-full bg-gray-100 mb-4' />
      {user && <View className='space-y-4 justify-center mx-5 mb-3'>
        <View className='flex-row space-x-4 items-center'>
          <Avatar uri={user.avatar} fallback={{ userName: user.name }} size='md' />
          <View className='flex-col w-[50%]'>
            <Text className='text-lg font-semibold'>{user.name}</Text>
            <Text className='text-xs text-gray-400 break-words'>{user.email}</Text>


          </View>
          <Pressable
            className='flex-row space-x-2 justify-end items-center'
            onPress={() => signOut().then(() => router.replace('/(auth)/landingpage'))}
          >
            <MaterialIcons name="logout" size={18} color="red" />
            <Text className='text-sm font-semibold text-red-500'>Logout</Text>
          </Pressable>
        </View>
        {user.verified === false && <View className='my-2 bg-red-500 rounded-lg p-2 justify-center items-center'>
          <Text className='text-sm text-gray-50'>O seu email ainda não foi verificado.</Text>
          <Link className='text-sm text-gray-50 font-semibold' href='/(auth)/verifyemail'>Clique aqui para verificar</Link>
        </View>}
      </View>}
      <View className='h-0.5 w-full bg-gray-100 mb-4' />
      <ScrollView className='flex-1'>
        {options.map((opt, idx, array) => {
          return <View key={idx}>
            <Pressable 
              className='w-[90%] h-12 flex-row space-x-3 mx-5 items-center'
              onPress={() => router.push(opt.route)}
            >
              {opt.icon}
              <Text className='text-lg font-medium'>{opt.name}</Text>
            </Pressable>
            {idx !== array.length-1 && <View className='h-0.5 w-full bg-gray-100 mb-4' />}
          </View>
        })}
      </ScrollView>
    </View>
  )
}