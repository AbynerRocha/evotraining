import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { MotiText } from 'moti'

export default function Loading() {
  return (
    <View className='h-full w-full items-center justify-center space-y-4'>
      <ActivityIndicator size={60} color='black' />
    </View>
  )
}