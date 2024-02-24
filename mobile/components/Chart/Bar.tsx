import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { MotiView } from 'moti'
import { Feather } from '@expo/vector-icons'

type BarChartProps = {
  data: {
    value: number,
    label: string
  }[]
  animated?: boolean
  color?: string
  width: number,
  height: number,
  barWidth?: number,
  onPress?: (index: number) => void
  labelColor?: string
  labelSize?: number
}

export default function BarChart({
  data,
  animated = false,
  height,
  width,
  barWidth = 20,
  color = 'rgb(30 64 175)',
  labelColor = 'rgb(212 212 212)',
  labelSize = 10,
  onPress
}: BarChartProps) {
  const maxPeriod = Math.ceil(data.length / 5)
  const [period, setPeriod] = useState(1)


  function showNavArrows() {
    return period > 1 && period !== maxPeriod
      ? <View className='items-center flex-row justify-around mt-3'>
        <Pressable onPress={previousPeriod} className='border border-blue-700 w-10 h-8 rounded-lg items-center justify-center'>
          <Feather name='chevron-left' size={25} color='black' />
        </Pressable>
        <Pressable onPress={nextPeriod} className='border border-blue-700 w-10 h-8 rounded-lg items-center justify-center'>
          <Feather name='chevron-right' size={25} color='black' />
        </Pressable>
      </View>
      : maxPeriod > 1 && period !== maxPeriod
        ? <View className='items-center flex-row justify-around mt-3'>
          <Pressable onPress={nextPeriod} className='border border-blue-700 w-10 h-8 rounded-lg items-center justify-center'>
            <Feather name='chevron-right' size={25} color='black' />
          </Pressable>
        </View>
        : period === maxPeriod && <View className='items-center flex-row justify-around mt-3'>
          <Pressable onPress={previousPeriod} className='border border-blue-700 w-10 h-8 rounded-lg items-center justify-center'>
            <Feather name='chevron-left' size={25} color='black' />
          </Pressable>
        </View>
  }

  function previousPeriod() {
    if (period === 1) return

    setPeriod((v) => v - 1)
  }

  function nextPeriod() {
    if (period === maxPeriod) return

    setPeriod((v) => v + 1)
  }

  return (
    <View className='flex-col space-y-2'>
      <View className='flex-col items-center w-72' style={{ height }}>
        <View className='w-full h-full flex-row items-end justify-around'>
          {data.slice(((period * 5) - 5), (period * 5)).map((value, idx) => {

            const barHeight = value.value * 4

            const style = {
              width: barWidth,
              height: barHeight,
              backgroundColor: color,
              borderTopStartRadius: 5,
              borderTopEndRadius: 5,
              maxHeight: height
            }

            return <Pressable key={idx} className='flex-col items-center'>
              <Text>{value.value}</Text>
              {
                animated
                  ? <MotiView
                    style={style}
                    from={{ height: 0, opacity: 0 }}
                    animate={{ height: barHeight, opacity: 1 }}
                    transition={{ type: 'timing', duration: 800 }}
                  />
                  : <View
                    style={style}
                  />
              }
              <Text className={`text-[${labelColor}] text-[${labelSize}px] mt-1`}>{value.label}</Text>
            </Pressable>
          })}
        </View>
      </View>
      {maxPeriod > 1 && showNavArrows()}
    </View>
  )
}

/*
<View 
      className='flex-row items-end justify-center h-[150px]'
    > 
      <Pressable className='flex-col items-center' onPress={onPress}>
        <Text className='text-gray-500 text-[11px]'>{dataY}</Text>
        <MotiView
          style={{
            width,
            height: (height*22),
            backgroundColor: 'rgb(30 64 175)',
            marginLeft: 10,
            marginRight: 10,
            borderTopStartRadius: 5,
            borderTopEndRadius: 5,
            maxHeight: 150,
          }}
          from={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: (height*22),
            opacity: 1
          }}

          transition={{
            type: 'timing',
            duration: 800
          }}
        />
        <Text className='mx-3 text-gray-400 text-[10px]'>{dayjs(dataX).locale('pt').format('MMM/YY')}</Text>
      </Pressable>
    </View>
*/