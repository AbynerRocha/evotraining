import { View, Text, Dimensions, TouchableOpacity, Pressable, Vibration, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from "react-native-chart-kit-chz"
import { ExerciseRecordUser, WorkoutData } from '../../@types/Workout'
import dayjs from 'dayjs'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/Auth/AuthContext'
import BarChart from '../../components/Chart/Bar'
import { useQuery } from 'react-query'
import { Api } from '../../utils/Api'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useApp } from '../../contexts/App/AppContext'

type Response = {
  data: {
    date: Date
    workout: WorkoutData
  }[]
}

export default function Perfil() {
  const { user } = useAuth()
  const screenWidth = Dimensions.get('window').width
  const router = useRouter()

  const { tab, setTabSelected } = useApp()

  useEffect(() => {
    if(tab !== 'perfil') setTabSelected({ 
      key: 'perfil',
      route: '/(tabs)/perfil'
    })
  }, [])

  const { data, isFetching: isFetchingFrequency, isLoading: isLoadingFrequency, error: errorFrequency } = useQuery({
    queryFn: async () => {
      const res = await Api.get<Response>('/user/frequency', { params: { uid: user?._id } })

      return organizeData(res.data.data)
    }
  })

  function organizeData(unordained: { date: Date, workout: WorkoutData }[]) {
    const result: { label: string, value: number }[] = []

    unordained.forEach(({ date }) => {
      if (result.find(v => v.label === dayjs(date).format('MMM/YY'))) return

      const count = unordained.filter(v => dayjs(v.date).isSame(date, 'month')).length

      result.push({
        label: dayjs(date).format('MMM/YY'),
        value: count
      })
    })

    return result
  }

  function renderName() {
    let name = user?.name

    name?.length! > 20 ? name = name?.slice(0, 20) : false
    name?.includes(' ') ? name = name.split(' ')[0] + ' ' + name.split(' ')[1][0] + '.' : false

    return name
  }

  return (
    <View className='bg-blue-800 h-full w-full'>
      <View className='w-full h-28 bg-gray-50' />
      <ScrollView className='flex-1 bg-gray-50'>
        <Text className='text-xl font-medium text-center mt-2'>Frequência de Treinos</Text>
        {
          isFetchingFrequency || isLoadingFrequency
            ? <View className='items-center mt-10  h-[150px]'>
              <ActivityIndicator size='large' color='black' />
            </View>
            : errorFrequency
              ? <View className='items-center mt-10 h-[150px]'>
                <Text>Não foi possivel carregar este dado</Text>
              </View>
              : <View className='flex-row items-center mt-10'>
                <Text className='-rotate-90 -mr-7 text-gray-400 text-xs'>N. de treinos</Text>
                <View className='w-[1] h-[155px] bg-gray-200 ml-2'/>
                {data && data.length > 0 ? <BarChart
                  data={data}
                  height={150}
                  width={screenWidth}
                  barWidth={25}
                  labelSize={11}
                  animated
                />
              : <View className='w-[80%] h-[150px] items-center justify-center'>
                  <Text className='text-lg font-semibold text-gray-300 -rotate-45'>Sem dados</Text>
              </View>
              }
              </View>
        }


      </ScrollView>
      <View
        className='absolute top-0 bg-blue-800 w-full h-24 items-start justify-center px-3'
      >

        <Avatar
          fallback={{ userName: user?.name! }}
          uri={user?.avatar}
          className='h-20 w-20 absolute -bottom-4 left-2'
          textClass='text-3xl'
          borderColor='rgb(248 250 252)'
          borderWidth={2.3}
        />
        <View className='h-fit w-[75%] absolute -bottom-0 left-24 justify-start items-start'>

          <Text className='text-gray-50 text-xl font-medium mb-2'>{renderName()}</Text>
        </View>
      </View>
    </View>
  )
}
