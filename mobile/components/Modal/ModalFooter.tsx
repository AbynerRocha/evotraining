import { View, Text } from 'react-native'
import React from 'react'

type ModalFooterProps = {
    children: React.ReactNode
}

export default function ModalFooter({ children }: ModalFooterProps) {
  return (
    <View>
      {children}
    </View>
  )
}