import { View, Text, ScrollView, Pressable, NativeScrollEvent, NativeSyntheticEvent, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { History } from '../../services/workouts'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useQuery } from 'react-query'
import Loading from '../loading'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { HistoryData } from '../../@types/User'
import { Api } from '../../utils/Api'
import ErrorPage from '../error'


export default function WorkoutHistory() {
  const { user } = useAuth()
  const router = useRouter()

  const [nextPage, setNextPage] = useState<number | null>(null)
  const [data, setData] = useState<HistoryData[]>([])
  const [error, setError] = useState<{ error: string, message: string }>()


  const { isFetching, isLoading, refetch, isRefetching } = useQuery({
    queryKey: '@fetchHistory',
    queryFn: async () => {
      const { history, nextPage: nextHistoryPage } = await History.get(user?._id!, 1)

      setNextPage(nextHistoryPage)
      setData(history)

      return history
    }
  })

  if (isLoading || isFetching) return <Loading />



  async function fetchNextPage() {
    if (nextPage === null) return

    Api.get('/user/workout-history', { params: { uid: user?._id, p: nextPage, li: 15 } })
      .then((res) => {
        setNextPage(res.data.nextPage)
        setData((v) => [...v, ...res.data.history])
      })
      .catch((err) => setError({ ...err.response.data }))
  }

  if (error) return <ErrorPage message={error.message} />
  if(!data)

  return (
    <View className='flex-1'>
      <View className='flex-row items-center my-3'>
        <Link href='/(tabs)/settings' className='px-3 py-1'>
          <Feather name='chevron-left' size={30} color='black' />
        </Link>
        <View className='flex-1 items-center mr-7'>
          <Text className='text-xl font-semibold'>Histórico de Treinos</Text>
        </View>
      </View>

      <FlatList
        data={data}
        className='mb-9'
        renderItem={({ item: history, index }) => {
          return <View key={index} className='flex-col w-full h-20'>
            <Pressable
              cancelable
              className='flex-row space-x-1 w-[85%] h-full items-center ml-1'
              onPress={() => router.push(`/workout/${history.workout._id}`)}
            >
              <View className='w-12 h-12 rounded-full items-center justify-center bg-blue-800'>
                <MaterialCommunityIcons name="dumbbell" size={24} color="white" />
              </View>
              <View className='flex-row items-center justify-between w-[100%] p-2 mr-4'>
                <Text className='text-lg'>{history.workout.name}</Text>
                <Text className='text-right'>{new Date(history.date).toLocaleDateString('pt-PT')}</Text>
              </View>
            </Pressable>

            <View
              className='h-[1] w-full bg-gray-300'
            />
          </View>
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.1}
        ListFooterComponent={nextPage !== null ? <ActivityIndicator size='small' color='black' className='mt-3' /> : null}
      />
    </View>
  )
}