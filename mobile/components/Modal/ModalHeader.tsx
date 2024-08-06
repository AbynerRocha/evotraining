import { View, Text } from 'react-native'
import React from 'react'

type ModalHeaderProps = {
  children: React.ReactNode
}

export default function ModalHeader({ children }: ModalHeaderProps) {
  return (
    <View>
      {children}
    </View>
  )
}