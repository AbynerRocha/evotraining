import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { ExerciseData } from '../../@types/Exercise';
import ExercisesList from './exerciseslist';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { twMerge } from 'tailwind-merge';
import { Api } from '../../utils/Api';
import { useAuth } from '../../contexts/Auth/AuthContext';
import { AxiosError } from 'axios';
import { Menu } from 'native-base';
import { useExerciseStore } from '../../utils/states/exercises';

type Fields = {
  name: string
}

type WorkoutExecutionData = {
  exercise: string
  reps: number
  series: number
  restTime: number
}

type SeriesData = {
  exercise: string
  series: {
    reps: number
    restTime: number
  }[]
}

export default function CreateWorkout() {
  const { formState: { errors }, control, setError, handleSubmit } = useForm<Fields>()
  const router = useRouter()
  const { user } = useAuth()

  const [showExerciseList, setShowExerciseList] = useState(false)
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [workoutExecutionInfo, setWorkoutExecutionInfo] = useState<WorkoutExecutionData[]>([])
  const [exerciseSelected, setExerciseSelected] = useState<ExerciseData>()
  const [showMenu, setShowMenu] = useState(false)
  const [series, setSeries] = useState<SeriesData[]>([])
  const [isPrivate, setIsPrivate] = useState(false)

  const { exercises: storagedExercises, setExercisesData } = useExerciseStore()

  useEffect(() => {
    for (const exercise of storagedExercises) {
      setSeries((v) => [...v, { exercise: exercise._id!, series: [{ reps: 10, restTime: 60 }] }])
    }

    setExercises(storagedExercises)
  }, [showExerciseList])

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...exercises];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);
    setExercises(copy);
  }

  function handleCreate({ name }: Fields) {
    setIsLoading(true)

    if (exercises.length < 2) {
      setError('root', { message: 'Você precisa adicionar ao menos 2 exercícios.' })
      return
    }

    Api.post('/workout', {
      name,
      createdBy: user?._id,
      exercises: series,
      isPrivate
    }).then((res) => {
      router.push(`/workout/${res.data.workout._id}`)
    })
      .catch((err: AxiosError<any>) => {
        console.log(err.response?.data)
        setError('root', { message: err.response?.data.message })
      })
      .finally(() => setIsLoading(false))
  }

  return showExerciseList ? <ExercisesList
    onStateChange={setShowExerciseList}
  /> : (
    <View className='h-screen w-screen'>

      <View className='px-3 pt-2 mb-4 mt-3'>
        <View className='flex-row w-full mb-3'>
          <Pressable
            onPress={() => router.back()}
          >
            <Ionicons name='chevron-back' color='black' size={30} />
          </Pressable>
          <View className='flex-1 items-center justify-center -ml-4'>
            <Text
              className='text-2xl italic font-bold text-center'
            >
              Criar um novo treino
            </Text>
          </View>
        </View>

        
          <Controller
            control={control}
            rules={{ required: { value: true, message: 'Este campo é obrigatório.' } }}
            name='name'
            render={({ field: { value, name, onBlur, onChange } }) => {
              return (
                <View className='space-y-2 w-full'>
                  <Text className='text-sm text-gray-500'>Nome</Text>
                  <View className='flex-row w-full h-fit items-center space-x-2'>

                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder='Digite aqui'
                      placeholderTextColor='rgb(163 163 163)'
                      className='bg-transparent border border-gray-300 p-3 rounded-lg text-md w-[82%]'
                    />
                    <Pressable
                      className='items-center justify-center border border-gray-300 h-14 w-14  rounded-lg'
                      onPress={() => setIsPrivate((v) => !v)}
                    >
                      <MaterialIcons name={isPrivate ? 'public-off' : 'public'} size={24} color='black' />
                    </Pressable>
                  </View>
                  {errors.name && <Text className='text-red-500 text-sm mt-2'>{errors.name.message}</Text>}
                  {errors.root && <Text className='text-red-500 text-sm mt-2'>{errors.root.message}</Text>}
                </View>
              )
            }}
          />

      </View>

      <View
        className='w-full h-[1px] bg-gray-300'
      />
      <View
        className='flex-1 w-full'
      >

        <DragList
          data={exercises}
          onReordered={onReordered}
          keyExtractor={(data: ExerciseData) => data._id}
          renderItem={(data: DragListRenderItemInfo<ExerciseData>) => {
            return (
              <Menu
                onOpen={() => {
                  setExerciseSelected(data.item)
                }}
                onClose={() => {
                  setExerciseSelected(undefined)
                }}
                closeOnSelect={true}
                className='max-h-60'
                trigger={(triggerProps => {
                  return <Pressable
                    {...triggerProps}
                    key={data.index}
                    className={twMerge('text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-gray-300 items-center', (data.isActive && 'opacity-50'))}
                    onLongPress={data.onDragStart}
                    onPressOut={data.isActive ? data.onDragEnd : () => {}}
                  >
                    <View className='flex-1 flex-row space-x-2 items-center'>
                      <Image
                        source={{ uri: data.item.image }}
                        width={40}
                        height={40}
                      />
                      <Text className='text-md font-medium'>{data.item.name}</Text>
                    </View>
                    <View>
                      <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
                    </View>
                  </Pressable>
                })}
              >
                {series.find(sr => sr.exercise === data.item._id)?.series.map((serieData, idx, array) => {

                  return <ScrollView key={idx}>
                    <View className='flex-col items-center'>
                      <View className='flex-row items-center justify-around space-x-2 pl-5 pr-3 py-2'>
                        <View className='justify-center items-center space-y-1'>
                          <Text className='text-xs'>N. de Reps</Text>
                          <Input
                            defaultValue={serieData.reps.toString()}
                            className='bg-transparent border border-gray-300 mx-3 w-12 h-12 text-center text-lg font-semibold rounded-md'
                            onChangeText={(value) => {
                              const newReps = parseInt(value)

                              if (!newReps || newReps === serieData?.reps) return

                              let dataToChange = array

                              const toAdd = series.filter(sr => sr.exercise !== data.item._id)

                              dataToChange[idx] = {
                                reps: newReps,
                                restTime: array[idx].restTime
                              }

                              setSeries([...toAdd, { exercise: data.item._id!, series: [...dataToChange] }])

                            }}
                          />
                        </View>
                        <View className='justify-center items-center space-y-1'>
                          <Text className='text-xs mb-1'>Tempo de Descanso</Text>
                          <View className='flex-row items-end mx-3'>
                            <Input
                              defaultValue={serieData.restTime.toString()}
                              keyboardType='numeric'
                              className='bg-transparent border border-gray-300  w-12 h-12 text-center text-lg font-semibold rounded-md'
                              onChangeText={(value) => {
                                if (value === '') return

                                const exerciseData = workoutExecutionInfo.find(w => w.exercise === exerciseSelected?._id)
                                const newRestTime = parseInt(value)

                                if (!exerciseData || newRestTime === exerciseData?.restTime) return

                                const data = workoutExecutionInfo.filter(w => w.exercise !== exerciseSelected?._id)

                                setWorkoutExecutionInfo([...data, { ...exerciseData, restTime: newRestTime }])
                              }}
                            />
                            <Text className='text-xs ml-1'>seg.</Text>
                          </View>
                        </View>

                        {array.length > 1 && <Pressable
                          className='h-full w-8 justify-center items-center'
                          onPressIn={() => {
                            const filteredData = array.filter(v => v !== array[idx])
                            const toAdd = series.filter(sr => sr.exercise !== data.item._id)

                            setSeries([...toAdd, { exercise: data.item._id!, series: filteredData }])
                          }}
                        >
                          <Feather name='x-circle' color='red' size={18} />
                        </Pressable>}
                      </View>
                      {idx !== array.length - 1 && <View className='w-full h-0.5 bg-gray-200 my-2' />}
                    </View>


                  </ScrollView>
                })}

                <View className='w-full h-0.5 bg-gray-200 my-2' />
                <Pressable
                  className='h-8 w-full'
                  onPress={() => {
                    const seriesData = series.find(sr => sr.exercise === data.item._id)

                    if (!seriesData) return

                    if (seriesData.series.length >= 10) {
                      return
                    }

                    const toAdd = series.filter(sr => sr.exercise !== data.item._id)

                    setSeries([...toAdd, {
                      exercise: seriesData.exercise,
                      series: [
                        ...seriesData.series,
                        {
                          reps: 10,
                          restTime: 60
                        }
                      ]
                    }])
                  }}

                >
                  <View className='w-full h-full space-x-2 flex-row items-center justify-center'>
                    <Feather size={16} name='plus-circle' color='rgb(163 163 163)' />
                    <Text className='text-gray-400'>Adicionar {series.find(sr => sr.exercise === data.item._id)?.series.length + '/10'}</Text>
                  </View>
                </Pressable>
              </Menu>
            )
          }}
        />
      </View>

      <View
        className='w-full h-[1px] bg-gray-300'
      />

      <View className='fixed bottom-3 w-full h-fit flex-col items-center justify-center space-y-2 mt-6'>
        <Pressable
          className='w-52 h-12 bg-blue-700 rounded-xl shadow-md shadow-black/50 flex-row space-x-2 items-center justify-center'
          onPress={() => {
            setShowExerciseList(true)

            setExercisesData(exercises)
          }}
        >
          <View>
            <Feather name='plus' size={20} color='white' />
          </View>
          <Text className='text-gray-50 font-bold'>Adicionar Exercício</Text>
        </Pressable>
        <View>
          <Button
            color='green'
            size='sm'
            textStyle='font-bold'
            isLoading={isLoading}
            className='w-52 h-12 shadow-md shadow-black/50'
            onPress={handleSubmit(handleCreate)}
          >
            Criar
          </Button>
        </View>
      </View>
    </View>
  )
}