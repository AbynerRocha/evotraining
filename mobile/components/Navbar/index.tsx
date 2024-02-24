import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useApp } from '../../contexts/App/AppContext'
import { useRouter } from 'expo-router'

export type Tabs = 'home' | 'workout' | 'perfil' | 'settings' | 'user_workouts';

export type TabsData = {
  name: string;
  key: Tabs
  route: string
}

type NavbarProps = {
  isOffline?: boolean
}

export default function Navbar({ isOffline }: NavbarProps) {
  const [tabSelected, setTab] = useState<Tabs>('home')
  const [tabs, setTabs] = useState<TabsData[]>([
    { name: 'Inicio', key: 'home', route: '/(tabs)/home' },
    { name: 'Perfil', key: 'perfil', route: '/(tabs)/perfil' },
    { name: 'Treinos', key: 'workout', route: '/(tabs)/workouts' },
    { name: 'Meus Treinos', key: 'user_workouts', route: '/(tabs)/user_workouts' },
    { name: 'Definições', key: 'settings', route: '/(tabs)/settings' },
  ])

  const { setTabSelected, tab } = useApp()
  const router = useRouter()

  useEffect(() => {
    setTab(tab)
  }, [tab])

  return (
    <View className='flex-row h-18 w-full mt-4'>
      <ScrollView horizontal className='px-3 py-2 space-x-3'>
        {tabs.map((tab, idx, arr) => {
          return <Pressable
            key={tab.key}
            className={twMerge('px-4 py-1 h-9 items-center justify-center', (tabSelected === tab.key && 'bg-blue-800 rounded-3xl'), (idx === arr.length - 1 && 'mr-8'))}
            onPress={() => {
              router.push(tab.route)

              setTab(tab.key)
              setTabSelected({
                key: tab.key,
                route: tab.route
              })
            }}
          >
            <Text className={twMerge('text-md font-semibold', (tabSelected === tab.key ? 'text-gray-50' : 'text-gray-950'))}>{tab.name}</Text>
          </Pressable>
        })}
      </ScrollView>
    </View>
  )
}