import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useApp } from '../../contexts/App/AppContext'

type BgTranslucentProps = {
    children: React.ReactNode | React.ReactNode[]
}

export default function BgTranslucent() {
  const { stateBgTranslucent } = useApp()
  return stateBgTranslucent === 'show' && (
    <View className='absolute top-0 h-full w-full mt-1 items-center bg-black/50'>
    </View>
  )
}