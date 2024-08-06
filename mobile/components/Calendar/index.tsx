import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { MotiView } from 'moti'
import { twMerge } from 'tailwind-merge'
import getDaysOfWeek from '../../utils/getDaysOfWeek'
import { FontAwesome } from '@expo/vector-icons';
import { Workout } from '../../@types/Workout'

type Props = {
  workout: Workout
}

export default function Calendar({ workout }: Props) {
  const [weekDays, setWeekDays] = useState(getDaysOfWeek())
  const [weekDaySelected, setWeekDaySelected] = useState(weekDays.find((d) => d.today === true) ?? weekDays[0])
  const [weekWorkout, setWeekWorkout] = useState<Workout[]>(workout)
  const [workoutData, setWorkout] = useState(weekWorkout.find((w) => dayjs(w.date).isSame(weekDaySelected.date, 'date')))
  const [animVisible, setAnimVisible] = useState(true)

  function handlerClickCalendar(day: { date: Date; day: string; weekday: string; weekDayId: number; today: boolean }) {
    if (weekDaySelected?.date === day.date) return

    setWeekDaySelected(day)
    setWorkout(weekWorkout.find((w) => dayjs(w.date).isSame(day.date, 'date')))
    setAnimVisible(false)

    setTimeout(() => {
      setAnimVisible(true)
    }, 150)
  }

  return  (
    <View>
      <View className='h-fit w-full items-end my-3'>
        <Text className='text-[14px] text-gray-800 mr-5'>Treinos da semana</Text>
      </View>

      <ScrollView horizontal className=''>
        <View className='h-fit w-full mx-5 flex-row space-x-5'>
          {weekDays.map((day, idx) => {
            return (
              <Pressable
                className='items-center space-y-2'
                key={idx}
                onPress={() => {
                  handlerClickCalendar(day)
                }}
              >
                <Text className='text-sm font-semibold text-gray-950 capitalize'>{day.weekday.split('-')[0]}</Text>
                <View className={twMerge('h-14 w-14 rounded-full items-center justify-center border', (weekDaySelected?.date === day.date ? 'bg-blue-800 border-blue-800' : 'bg-transparent border-black'))}>
                  <Text className={twMerge('text-lg font-semibold', (weekDaySelected?.date === day.date ? 'text-gray-50' : 'text-gray-950'))}>{day.day}</Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
      <View className='mt-10 w-full items-center'>
        <View className='w-full items-center justify-center'>

          {/* {animVisible && <MotiView
            className='bg-blue-800 flex-row rounded-3xl h-32 w-[90%] items-center justify-center'
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <View className='w-[90%] h-full items-center justify-center'>
              <Text className='text-xl font-bold text-gray-50 italic'>{workout?.workout.name}</Text>
            </View>
            <View className='mr-4'>
              {!workout?.workout.dayOff && <FontAwesome name='chevron-right' size={20} color='white' />}
            </View>
          </MotiView>} */}
        </View>
      </View>
    </View>
  )
}