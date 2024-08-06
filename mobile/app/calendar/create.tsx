import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import getDaysOfWeek from '../../utils/getDaysOfWeek'
import { twMerge } from 'tailwind-merge'
import { ExerciseInfo, WorkoutData } from '../../@types/Workout'
import { Feather } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import Input from '../../components/Input'
import { useAuth } from '../../contexts/Auth/AuthContext'
import Button from '../../components/Button'
import SavedWorkouts from './savedworkoutslist'
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import { Api } from '../../utils/Api'
import { Alert } from 'native-base'
import { MotiView, useAnimationState, useDynamicAnimation } from 'moti'

export default function CreateCalendar() {
  const router = useRouter()
  const { user } = useAuth()

  const [week, setWeek] = useState([
    { name: 'Domingo', value: 'domingo' },
    { name: 'Segunda', value: 'segunda' },
    { name: 'Terça', value: 'terca' },
    { name: 'Quarta', value: 'quarta' },
    { name: 'Quinta', value: 'quinta' },
    { name: 'Sexta', value: 'sexta' },
    { name: 'Sabádo', value: 'sabado' },
  ])

  const [selected, setSelected] = useState<string>(week[0].value)
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutData>()
  const [workouts, setWorkouts] = useState<{ value: string, workout: WorkoutData, restDay: boolean }[]>([])
  const [trainingPlanName, setTrainingPlanName] = useState(`Plano de treino de ${user?.name}`)
  const [isShowingSavedWorkouts, setIsShowingSavedWorkouts] = useState(false)
  const [error, setError] = useState<{ type: string, message: string }>({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const notifAnim = useAnimationState({
    from: {
      translateY: 200
    },
    to: {
      translateY: 0
    },
    hide: {
      translateY: 200
    }
  })

  useEffect(() => {
    if(error.type === 'root') {
      notifAnim.transitionTo('to')

      clearErrors()
    }
  }, [error])

  function clearErrors() {
    setTimeout(() => {
      notifAnim.transitionTo('hide')

      setTimeout(() => setError({ type: '', message: '' }), 500)
    }, 3500)
  }

  function numberOfSeries(exercises: ExerciseInfo[]) {
    let series = 0

    for (const info of exercises) {
      series = series + info.series.length
    }

    return series
  }

  function handleCreate() {
    clearErrors()
    setIsLoading(true)

    if (trainingPlanName === '') {
      if(error.type === 'name') {
        setIsLoading(false)
        return
      } 

      setError({
        type: 'name',
        message: 'Este campo é obrigatório.'
      })
      setIsLoading(false)
      return
    }

    if (workouts.length < 2) {
      if(error.type === 'root') {
        setIsLoading(false)
        return
      } 
      
      setError({
        type: 'root',
        message: 'Você precisa selecionar pelo menos 2 treinos.'
      })
      setIsLoading(false)
      return
    }

    var plan: { weekDay: string, restDay: boolean, workout: WorkoutData | null }[] = []

    

    for (let i = 0; i < week.length; i++) {
      const day = week[i]
      const workout = workouts.find(w => w.value === day.value)
      
      plan.push({
        weekDay: workout?.value || day.value,
        restDay: workout?.restDay || true,
        workout: workout?.workout || null
      })
    }

    Api.post('/user/training-plan', {
      name: trainingPlanName,
      user: user?._id,
      plan
    }).then(() => {
      router.replace('/calendar/success')
    }).catch((err) => {
      if (!err.response.data.message) {
        setError({
          type: 'root',
          message: 'Não foi possivel realizar esta ação'
        })
        return
      }

      setError({
        type: 'root',
        message: err.response.data.message
      })
    }).finally(() => setIsLoading(false))
  }

  return isShowingSavedWorkouts ? <SavedWorkouts
    onClose={() => setIsShowingSavedWorkouts(false)}
    onSelect={(data) => {
      const verify = workouts.find(w => w.value === selected)

      if (verify) {
        const filtered = workouts.filter(w => w.value !== selected)
        filtered.push({ value: selected, workout: data, restDay: false })

        setWorkouts(filtered)
        setWorkoutSelected(data)
        return
      }

      setWorkouts((v) => [...v, { value: selected, workout: data, restDay: false }])
      setWorkoutSelected(data)
    }}
  /> : (
    <View className='flex-1'>
      <View className='flex-row space-x-4 items-center mt-3'>
        <Link href='/(tabs)/home'>
          <Feather name='chevron-left' size={35} color='black' />
        </Link>
        <Text className='text-3xl font-semibold '>Criar Plano de Treino</Text>
      </View>
      <View className='flex-1 items-center mt-8'>
        <View className='w-full mb-2'>
          <Text className={twMerge('mx-3 text-gray-500 mb-2', (error.type === 'name' && 'text-red-300'))}>Nome do plano</Text>
          <Input
            className={twMerge('w-[94%] mx-3 h-16 border border-gray-300 rounded-xl p-2', (error.type === 'name' && 'border-red-500'))}
            defaultValue={trainingPlanName}
            onChangeText={setTrainingPlanName}
          />
          {error.type === 'name' && <Text className='text-red-500 text-xs ml-3 mt-1'>{error.message}</Text>}
        </View>
        <View className='w-full h-24'>
          <ScrollView horizontal className='p-3 space-x-2 w-full h-20'>
            {week.map((day, idx, array) => {
              return <Pressable
                key={idx}
                className={twMerge(
                  'border-blue-800 border h-16 w-16 rounded-full items-center justify-center p-1',
                  (idx === array.length - 1 && 'mr-5'),
                  (selected === day.value && 'bg-blue-800')
                )}
                onPress={() => {
                  if (selected === day.value) return

                  setSelected(day.value)

                  const workout = workouts.find((w) => w.value === selected)

                  workout && setWorkoutSelected(workout.workout)
                }}
              >
                <Text className={twMerge('font-bold text-xs', (selected === day.value && 'text-gray-50'))}>{day.name}</Text>
              </Pressable>
            })}
          </ScrollView>
        </View>
      </View>
      <View className='h-[50%] justify-center'>
        {workouts.find((w) => w.value === selected)
          ? <View className='h-full w-full'>
            <View className='p-3'>
              <Text className='text-3xl font-semibold'>{workoutSelected?.name}</Text>

              <View className='flex-row items-center'>
                <Text className='text-lg'>Dificuldade Média: </Text>
                <WorkoutDifficulty size={14} className='flex-row space-x-1' difficulty={workoutSelected?.exercises ? calcWorkoutDifficulty(workoutSelected?.exercises) : 3} />
              </View>
              <Text className='text-lg'>Número de exercícios: {workoutSelected?.exercises.length}</Text>
              <Text className='text-lg'>Total de Séries: {numberOfSeries(workoutSelected?.exercises!)}</Text>
              <View className='flex-row space-x-2 items-center mt-3'>
                <Button onPress={() => setIsShowingSavedWorkouts(true)}>Trocar Treino</Button>
                <Button onPress={() => {
                  const filtered = workouts.filter(w => w.value !== selected)

                  setWorkouts(filtered)
                }}
                  color='red'
                >
                  Remover
                </Button>
              </View>
            </View>

          </View>
          : <Pressable className='flex-row space-x-2 justify-center items-center h-full w-full' onPress={() => setIsShowingSavedWorkouts(true)}>
            <Feather name='plus-circle' size={28} color='rgb(212 212 212 )' />
            <Text className='text-gray-300'>Selecionar Treino</Text>
          </Pressable>
        }
      </View>
      <View className='h-32 w-full items-center justify-center p-2'>
        <Button size='lg' textSize='lg' onPress={handleCreate} isLoading={isLoading}>Finalizar</Button>
      </View>

      <View
        className='absolute bottom-24 w-[100%] h-fit'
      >
        <MotiView 
          className='w-full h-fit items-center'
          state={notifAnim}
          transition={{
            delay: 400,
            duration: 600
          }}
        >
          {error.type === 'root' && <Alert status='error' colorScheme='error'>
            <View className='flex-row items-center space-x-2 w-48 break-words'>
              <View>
                <Alert.Icon />
              </View>
              <Text className='text-red-900 font-medium mr-5'>{error.message}</Text>
            </View>
          </Alert>}
        </MotiView>
      </View>
    </View>
  )
}