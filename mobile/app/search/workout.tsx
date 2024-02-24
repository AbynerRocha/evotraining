import { View, Text, Pressable, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import Input from '../../components/Input'
import { Feather, Ionicons } from '@expo/vector-icons'
import Button from '../../components/Button'
import { useQuery } from 'react-query'
import { Api } from '../../utils/Api'
import Loading from '../loading'
import ErrorPage from '../error'
import { WorkoutData } from '../../@types/Workout'
import { FlatList } from 'native-base'
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import { useRouter } from 'expo-router'

export default function SearchWorkout() {
  const router = useRouter()
  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })

  const [name, setName] = useState('')
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [data, setData] = useState<WorkoutData[]>([])
  const { isFetching, isLoading, error, isRefetching, refetch } = useQuery<WorkoutData[], any>({
    queryFn: async () => {
      const res = await Api.get('/workout')

      setData(res.data.workouts)
      setNextPage(res.data.nextPage)

      return res.data.workouts
    }
  })

  if (isLoading || isFetching) return <Loading />
  if (error) return <ErrorPage message={error.message} />

  function handleSearch() {
    if (name === '') return

    console.warn('Procurando...')

    Api.get('/workout', {
      params: {
        name,
        pvts: false,
      }
    }).then((res) => {
      setData(res.data.workouts)
    })
      .catch((err) => { })
  }

  async function fetchMoreData() {
    if (nextPage === null) return

    const res = await Api.get('/workouts', {
      params: {
        name,
        pvts: false,
        li: 10, 
        p: nextPage
      }
    })

    const fecthedData: WorkoutData[] = res.data.workoutData
    const nextExercisePage: number | null = res.data.nextPage

    setNextPage(nextExercisePage)

    setData((v) => [...v, ...fecthedData])
  }

  return (
    <View className='flex-1 w-full'>
      <View className='mt-3'>
        <Feather name='chevron-left' size={30} color='black' />
      </View>
      <View className='w-full items-center mt-4 flex-row space-x-2 mx-3'>
        <Input
          className='w-[80%] h-14 bg-transparent border border-gray-300 rounded-xl justify-center px-3'
          placeholder='Procure aqui'
          placeholderTextColor={'rgb(209 213 219)'}
          onChangeText={setName}
        />
        <Button
          isLoading={isFetching || isLoading}
          className='bg-transparent p-1 w-12 h-14 border border-gray-300'
          onPress={handleSearch}
        >
          <Feather name='search' size={15} color='black' />
        </Button>
      </View>

      {data?.length === 0
        ? <Text className='font-medium text-lg text-center mt-5'>Sem treinos registados.</Text>
        : <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              className='m-3 h-20 p-2 rounded-lg border border-gray-300'
              onPressIn={() => router.push(`/workout/${item._id}`)}
            >
              <View className='w-full h-full justify-between'>
                <Text className='font-semibold'>{item.name}</Text>
                <View className='flex-row space-x-1 justify-between'>
                  <WorkoutDifficulty
                    className='flex-row space-x-1'
                    difficulty={calcWorkoutDifficulty(item.exercises)}
                  />

                  <View className='flex-row items-center space-x-1'>
                    <Ionicons name="cloud-download-outline" size={13} color="rgb(160 160 160)" />
                    <Text className='text-xs text-gray-400'>{formatter.format(item.saves)}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.10}
          ListFooterComponent={nextPage !== null ? <ActivityIndicator size='small' color='black' /> : null}
        />}
    </View>
  )
}