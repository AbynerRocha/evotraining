import { View, Text, ScrollView, Pressable, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { Feather, Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { Api } from '../../utils/Api';
import { AxiosError } from 'axios';
import { ExerciseData } from '../../@types/Exercise';
import { Image } from 'moti';
import { twMerge } from 'tailwind-merge';
import { MuscleData } from '../../@types/Muscle';
import { useQuery } from 'react-query';
import Loading from '../loading';
import { useExerciseStore } from '../../utils/states/exercises';

type FiltersData = {
  name: string
  muscle: MuscleData[]
}

type ExerciseListProps = {
  onStateChange: (state: boolean) => void
}

export default function ExercisesList({ onStateChange }: ExerciseListProps) {
  const [page, setPage] = useState(1)
  const [fetchedExercises, setFetchedExercises] = useState<ExerciseData[]>([])
  const [fetchError, setFetchError] = useState('')
  const [muscles, setMuscles] = useState<MuscleData[]>([])
  const [filters, setFielters] = useState<FiltersData>({
    name: '',
    muscle: []
  })
  const { exercises, setExercisesData } = useExerciseStore()
  const [exerciseSelectedList, setExerciseSelectedList] = useState<ExerciseData[]>([])
  const [nextPage, setNextPage] = useState<number | null>(null)
  
  useEffect(() => {
    setExerciseSelectedList(exercises)
  }, [])

  const { isFetching, isLoading, isRefetching, isError, refetch } = useQuery({
    queryKey: '@fetchExercises',
    queryFn: async () => {
      const res = await Api.get('/exercise', { params: { li: 10 }})

      const exerciseFetched: ExerciseData[] = res.data.exercises
      const nextExercisePage: number | null = res.data.nextPage
      
     
      setNextPage(nextExercisePage)
      setFetchedExercises(exerciseFetched)

      Api.get('/muscle')
        .then((res) => {
          setMuscles(res.data.muscles)
        })

      return exerciseFetched
    }
  })

  async function fetchNextPage() {
    if(nextPage === null) return

    const res = await Api.get('/exercise', { params: { li: 10, p: nextPage } })

    const exerciseFetched: ExerciseData[] = res.data.exercises
    const nextExercisePage: number | null = res.data.nextPage

    setPage(nextPage)
    setNextPage(nextExercisePage)

    setFetchedExercises((v) => [...v, ...exerciseFetched])
  }

  function getFilteredExercises() {
    let filteredMuscles: ExerciseData[] = []
    if (!fetchedExercises || !filters) return

    const regex = new RegExp(`.*${filters.name}*.`, 'i')

    return []
  }


  function handleSelectExercise(exercise: ExerciseData) {
    if (exerciseSelectedList.find((e) => e._id === exercise._id)) {
      const toUpdate = exerciseSelectedList.filter(e => e._id !== exercise._id)

      setExerciseSelectedList(toUpdate)
      return
    }
    
    setExerciseSelectedList((v) => [...v, exercise])
  }

  function handleChangeExercises() {
    let data = []

    for (const exercise of exerciseSelectedList) {
      data.push(exercise)
    }

    setExercisesData(data)
    onStateChange(false)
  }

  if (isFetching || isLoading) return <Loading/>

  if (isError) return <View className='h-screen w-screen items-center justify-center bg-gray-50 space-y-2'>
    <Feather name='x-circle' color='red' size={40} />
    <Text className='text-md font-medium text-center'>Não foi possivel realizar esta ação neste momento.</Text>
  </View>

  return <View className='h-screen w-screen p-3 items-center justify-center bg-gray-50'>
    <Text className='text-center text-xl font-medium mb-3'>Selecione os exercicios</Text>

    <View className='w-full p-3'>
      <Input
        className='w-full h-12 p-3 rounded-xl border border-gray-300'
        placeholder='Procure aqui'
        onChangeText={(text) => {
          if (text.length > 0) {
            setFielters((f) => ({ name: text, muscle: f.muscle }))
          }
        }}
      />
      {/* <ScrollView horizontal className='flex-row space-x-2 p-3'>
        {muscles.map((muscle, idx) => {
          const filtered = filters.muscle.find((m) => m._id === muscle._id)

          return <Pressable
            key={muscle._id}
            className={twMerge('w-24 h-7 rounded-full items-center justify-center', (filtered ? 'bg-blue-700' : 'bg-transparent'))}
            onPress={() => {
              if (filtered) {
                const updated = filters.muscle.filter((m) => m._id !== filtered._id)

                setFielters((f) => ({ name: f.name, muscle: updated }))
                return
              }

              const muscleFilters = filters

              muscleFilters.muscle.push(muscle)

              setFielters((f) => ({ name: f.name, muscle: [...f.muscle] }))
            }}
          >
            <Text className={twMerge('font-medium', (filtered ? 'text-gray-50' : 'text-gray-950'))}>{muscle.name.length > 10 ? muscle.name.slice(0, 10) + '...' : muscle.name}</Text>
          </Pressable>
        })}
      </ScrollView> */}
    </View>
    <FlatList
      data={filters.name === '' && filters.muscle.length === 0 ? fetchedExercises : getFilteredExercises()}
      keyExtractor={(item) => item._id!}
      className='h-[88%] w-full space-y-3'
      refreshControl={<RefreshControl 
        refreshing={isRefetching} 
        onRefresh={refetch} 
      />
      }
      renderItem={({ item: exercise, index }) => {
        return <Pressable
          className={twMerge('p-3 h-20 w-full bg-gray-100 border border-gray-300 rounded-lg flex-row justify-between space-x-2 my-2', (index === fetchedExercises.length-1 && 'mb-4'))}
          onPress={() => handleSelectExercise(exercise)}
        >
          <View className='flex-row space-x-2 items-center'>
            <View className='w-fit h-fit rounded-full'>
              <Image
                source={{ uri: exercise.image }}
                alt={exercise.name}
                height={50}
                width={50}
                className='object-cover'
              />
            </View>
            <View>
              <Text className='font-medium text-md'>{exercise.name.length > 24 ? exercise.name.slice(0, 24) + ' ...' : exercise.name}</Text>
            </View>
          </View>
          <View>
            {exerciseSelectedList.find((e) => e._id === exercise._id) && <View
              className='bg-blue-700 rounded-full w-6 h-6  items-center justify-center'
            >
              <Text className='text-s font-semibold text-gray-50'>{exerciseSelectedList.findIndex((e) => e._id === exercise._id) + 1}</Text>
            </View>}
          </View>
        </Pressable>
      }}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.1}
      ListFooterComponent={nextPage !== null ? <ActivityIndicator size='small' color='black' /> : null}
    />

    <View className='mt-12'></View>

    <View className='absolute bottom-1 w-full h-20'>
      <View className='flex-row w-full h-full space-x-2 justify-center items-center'>
        <Button onPressIn={handleChangeExercises}>
          Concluir
        </Button>
        <Button onPress={() => onStateChange(false)} color='red' size='sm'>Cancelar</Button>
      </View>
    </View>
  </View>
}
