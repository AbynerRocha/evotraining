import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Input from '../../components/Input'
import { MotiView, useAnimationState } from 'moti'
import { Accordion, Divider, Menu } from 'native-base'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import BarChart from '../../components/Chart/Bar'
import * as Progress from 'react-native-progress';

export default function Test() {
  const [show, setShow] = useState(false)
  const [percentage, setPercentage] = useState(0.1)

  const data = [
    { value: 1, label: 'Dez/12' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ]

  return (
    <View className='flex-1 w-full items-center justify-center px-4'>
      <Progress.Bar width={300} height={20} borderRadius={999} progress={percentage} color='rgb(30 64 175)' />

      <Button onPressIn={() => setPercentage((v) => v !== 1 ? v+0.1 : v-0.9)}>Add</Button>
    </View>
  )
}