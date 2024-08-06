import { View, Platform } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'

export default function AuthLayout() {
  return (
    <View className={Platform.OS === 'android' ? 'h-screen w-screen' : 'h-screen w-screen'}>
      <Slot />
    </View>
  )
}