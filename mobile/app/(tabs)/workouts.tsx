import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons'
import { twMerge } from 'tailwind-merge'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Api } from '../../utils/Api'
import { AxiosError, AxiosResponse } from 'axios'
import { WorkoutData } from '../../@types/Workout'
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import Loading from '../loading'
import { useQuery } from 'react-query'
import ErrorPage from '../error'
import { useApp } from '../../contexts/App/AppContext'


export default function Workouts() {
  const { user } = useAuth()
  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })
  const router = useRouter()
  const { tab, setTabSelected } = useApp()

  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [oldWorkouts, setOldWorkouts] = useState<WorkoutData[]>([])
  const [filters, setFilters] = useState([
    { name: 'Salvos', value: 1 },
    { name: 'Populares', value: 2 }
  ])

  const [filterApplied, setFilterApplied] = useState<number>(0)
  const [error, setError] = useState({ type: '', message: '' })
  const { data, isFetching, isLoading } = useQuery({
    queryKey: '@getAllWorkouts',
    queryFn: fetchWorkouts
  })

  useEffect(() => {
    if(tab !== 'workout') setTabSelected({ 
      key: 'workout',
      route: '/(tabs)/workouts'
    })
  }, [])

  useEffect(() => {
    if (!data) return

    setWorkouts(data)
    setOldWorkouts(data)
  }, [data])


  async function fetchWorkouts() {
    const res = await Api.get('/workout', { params: { pvts: false }})
      .then((res: AxiosResponse<{ workouts: WorkoutData[] }>) => res.data.workouts)
      .catch((err: AxiosError<any>) => {
        if(!err.response?.data.error) return

        switch(err.response.data.error) {
          case 'PAGE_NOT_FOUND': 
            setError({ type: 'results', message: '' })
            break
          default: 
            setError({ type: 'others', message: 'Não foi possivel realizar esta ação neste momento.' })
            break
        }
      })


    return res
  }

  if (isFetching || isLoading) return <Loading />

  if (error.type === 'others') return <ErrorPage message='Não foi possivel realizar esta ação neste momento.' />

  return (
    <View className='flex-1'>
      <View className='w-full items-center space-y-4'>
        <View className='flex-row space-x-2'>
          <Pressable
            className='w-[70%] bg-gray-100 border border-gray-200 rounded-full h-12 px-5 py-3'
            onPress={() => router.push('/search/workout')}
          >
            <Text className='text-sm font-medium text-gray-400'>Procure aqui</Text>
          </Pressable>
        </View>
      </View>

      <View className='flex-1'>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return <Pressable
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
          }}
        />
      </View>


      {user && <View>
        <Link href='/workout/create' className='absolute bottom-10 right-0 mr-3'>
          <View className='bg-blue-800 rounded-full h-16 w-16  items-center justify-center shadow-md shadow-black/50'>
            <FontAwesome name='plus' color='white' size={20} />
          </View>
        </Link>
      </View>}
    </View>
  )
}