import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Api } from '../../utils/Api'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { WorkoutData } from '../../@types/Workout'
import ErrorPage from '../error'
import Loading from '../loading'
import { Feather, Ionicons } from '@expo/vector-icons';
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import { useRouter } from 'expo-router'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import { AxiosError } from 'axios'

type Props = {
  onClose: () => void
  onSelect: (data: WorkoutData) => void
}

export default function SavedWorkouts({ onClose, onSelect }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [data, setData] = useState<{ workout: WorkoutData }[]>([])
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [error, setError] = useState<{ error: string, message: string } | null>(null)

  const { isLoading, isFetching, refetch } = useQuery({
    queryKey: '@fetchSavedWorkouts',
    queryFn: async () => {
      Api.get('/user/saved-workouts', { params: { uid: user?._id } })
      .then((res) => {
        setData(res.data.savedWorkouts)
        setNextPage(res.data.nextPage)
      })
      .catch((err: AxiosError<any>) => {
        setError({
          error: err.response?.data.error,
          message: err.response?.data.message,
        })
      })
    }
  })

  if (error) return <ErrorPage message={error.message} />
  if (isLoading || isFetching) return <Loading />
  if (!data || data.length === 0) return <View className='flex-1 items-center justify-center space-y-2'>
    <Feather name="alert-triangle" size={50} color="black" />
    <Text className='text-lg font-medium'>Você ainda não salvou nenhum treino</Text>
    <Pressable className='flex-row items-center' onPress={onClose}>
      <Feather name='chevron-left' size={25} color='black' />
      <Text className='text-lg'>
        Voltar
      </Text>
    </Pressable>
  </View>

  function handleRefresh() {
    setIsRefreshing(false)
    refetch()
  }

  return (
    <View className='flex-1 mt-3'>
        <FlatList 
          data={data}
          keyExtractor={(item) => item.workout._id}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          renderItem={({ item }) => {
            return <Pressable
            className='m-3 h-20 p-2 rounded-lg border border-gray-300'
            onPress={() => {
              onSelect(item.workout)
              onClose()
            }}
            cancelable
          >
            <View className='w-full h-full justify-between'>
              <Text className='text-lg font-semibold'>{item.workout.name}</Text>
              <View className='flex-row space-x-1 justify-between'>
                <WorkoutDifficulty
                  className='flex-row space-x-1'
                  difficulty={calcWorkoutDifficulty(item.workout.exercises)}
                />

                <View className='flex-row items-center space-x-1'>
                  <Ionicons name="cloud-download-outline" size={13} color="rgb(160 160 160)" />
                  <Text className='text-xs text-gray-400'>{formatter.format(item.workout.saves)}</Text>
                </View>
              </View>
            </View>
          </Pressable>
          }}
        />
    </View>
  )
}