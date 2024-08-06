import { View, Platform, StatusBar } from 'react-native'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { AuthProvider } from '../contexts/Auth/AuthContext'
import { clientQuery } from '../utils/queryClient'
import { Slot } from 'expo-router'
import { AppProvider } from '../contexts/App/AppContext'
import dayjs from 'dayjs'
import 'dayjs/locale/pt'

dayjs.locale('pt')

export default function Layout() {
  return (
    <QueryClientProvider client={clientQuery}>
      <AppProvider>
        <AuthProvider>
          <View className={Platform.OS === 'android' ? 'mt-8 h-full w-full' : 'h-full w-full'}>
            <StatusBar barStyle='dark-content' backgroundColor='white' />
            <Slot />
          </View>
        </AuthProvider>
      </AppProvider>
    </QueryClientProvider>
  )
}