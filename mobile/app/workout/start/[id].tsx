
import { View, Text } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Api } from '../../../utils/Api'
import { WorkoutData } from '../../../@types/Workout'
import { useQuery } from 'react-query'
import Loading from '../../loading'
import { AxiosError } from 'axios'
import { Feather } from '@expo/vector-icons'
import Button from '../../../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalStorageKeys } from '../../../database/keys'
import { useExercisesStore } from '../../../utils/states/exercises'

type Params = { id: string }

export default function StartWorkout() {
  const { id } = useLocalSearchParams<Params>()

  const { data, isFetching, isLoading, error } = useQuery<WorkoutData, AxiosError<any>>({
    queryKey: '@startWorkout',
    queryFn: fetchWorkout
  })

  const { setExercisesData } = useExercisesStore()


  async function fetchWorkout() {
    const res = await Api.get<{ workout: WorkoutData }>('/workout', { params: { id }})
    return res.data.workout
  }

  function handleStart() {
    if(!data?.exercises) return

    setExercisesData(data?.exercises)

    router.replace('/workout/start/exercise/'+id)
  }

  if (isFetching || isLoading) return <Loading />
  
  if (error) return <View className='h-[80%] w-full items-center justify-center bg-gray-50 flex flex-col space-y-2 mx-4'>
    <Feather name='x-circle' color='red' size={50} />
    <Text className='text-md text-red-500'>{error.response?.data.message}</Text>
  </View>

  return (
    <View
      className='flex-1 bg-blue-800 items-center justify-center'
    >
      <View
        className='bg-gray-50 h-60 w-[95%] rounded-lg p-3 shadow-md shadow-white'
      >
        <Text className='text-3xl text-center font-semibold italic'>{data?.name && data.name.length > 23 ? data?.name.slice(0, 23) + '...' : data?.name}</Text>

        <View className='flex-1 items-center justify-center'>
          <Button 
            size='lg' 
            textSize='lg'
            onPress={handleStart}
          >
            Iniciar Treino
          </Button>
        </View>
      </View>
    </View>
  )
}

