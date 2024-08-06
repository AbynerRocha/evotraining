import { View, Text } from 'react-native'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { IAvatarProps, Avatar as NBAvatar } from 'native-base'

type AvatarProps = IAvatarProps & {
  fallback?: { userName?: string }
  className?: string
  uri: string | undefined
  textClass?: string
}

export default function Avatar({ fallback, className, textClass, uri, ...rest }: AvatarProps) {
  return <NBAvatar {...rest} className={twMerge('bg-blue-800', className)} source={{ uri }}>
    {fallback && fallback.userName && <Text className={twMerge('text-2xl font-bold text-gray-50', textClass)}>{fallback && fallback.userName[0].toUpperCase()}</Text>}
  </NBAvatar>
}
    // <View className={twMerge('bg-blue-800 rounded-full w-14 h-14 items-center justify-center', className)}>
    //   <Text className={twMerge('text-2xl font-bold text-gray-50', textClass)}>{fallback && fallback.userName[0].toUpperCase()}</Text>
    // </View>