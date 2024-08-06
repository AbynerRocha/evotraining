import { View, Text, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ExerciseInfo } from '../../../../@types/Workout'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useExercisesStore } from '../../../../utils/states/exercises'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'
import { Modal } from 'native-base'
import { CountdownCircleTimer, useCountdown } from 'react-native-countdown-circle-timer'
import { UserExerciseStats } from '../../../../database/controller/workout'
import { History } from '../../../../services/workouts'
import { useAuth } from '../../../../contexts/Auth/AuthContext'
import { useApp } from '../../../../contexts/App/AppContext'
import * as Progress from 'react-native-progress';

type Params = {
  exercises: string
}

type Stats = {
  exerciseId: string
  series: {
    weight: number
    reps: number
  }[]
}

export default function StartExercise() {
  const { user } = useAuth()
  const { id: workoutId } = useLocalSearchParams<{ id: string }>()
  const { setTabSelected} = useApp()

  const [exercises, setExercises] = useState<ExerciseInfo[]>(useExercisesStore((state) => state.exercises))
  const [toDoExercise, setToDoExercise] = useState(exercises[0])
  const [isShowingModalTimer, setIsShowingModalTimer] = useState(false)
  const [isShowingModalWeight, setIsShowingModalWeight] = useState(false)
  const [serie, setSerie] = useState({ ...toDoExercise.series[0], number: 1 })
  const [weight, setWeight] = useState(0)
  const [workoutStats, setWorkoutStats] = useState<Stats[]>([])

  const numberOfExercises = exercises.length
  const numberOfSeries = toDoExercise.series.length

  const router = useRouter()

  if(!workoutId) {
    setTabSelected({ key: 'workout', route: '/(tabs)/workouts' })
    router.replace('/(tabs)/workouts')
    return
  }

  function renderTopBalls() {
    const toDoExerciseIdx = exercises.findIndex(ex => ex === toDoExercise)
    var tmpNumberOfExercises = numberOfExercises
    var remainingExercises = numberOfExercises - (toDoExerciseIdx + 1)

    var JSX: React.ReactNode[] = []

    while (tmpNumberOfExercises != 0) {
      if (remainingExercises > 0) {
        JSX.push(<View key={tmpNumberOfExercises} className='rounded-full bg-gray-400 h-2 w-2' />)
        remainingExercises = remainingExercises - 1
        tmpNumberOfExercises = tmpNumberOfExercises - 1
      } else {
        JSX.push(<View key={tmpNumberOfExercises} className='rounded-full bg-gray-50 h-2 w-2' />)
        tmpNumberOfExercises = tmpNumberOfExercises - 1
      }
    }

    return JSX
  }

  function nextExercise() {
    const exerciseIdx = exercises.findIndex(ex => ex === toDoExercise)

    if (exerciseIdx - (exercises.length - 1) === 0 && serie.number === numberOfSeries) {
      History.add(user?._id!, workoutId!)

      router.replace('/workout/end')
      return
    }

    if (serie.number !== numberOfSeries) {
      const nextSerie = toDoExercise.series[serie.number]
  
      setSerie((v) => ({ ...nextSerie, number: v.number + 1 }))
      return
    }
    
    setToDoExercise(exercises[exerciseIdx + 1])
    setSerie({ ...toDoExercise.series[0], number: 1 })
  }

  function handleSaveStats() {
    if (!weight || weight === 0) {
      return
    }

    const exerciseSeries = workoutStats.find(stats => stats.exerciseId === toDoExercise.exercise._id)?.series
    const UserStats = new UserExerciseStats(toDoExercise.exercise._id!)

    if (!exerciseSeries) {
      const toAdd: Stats = {
        exerciseId: toDoExercise.exercise._id!,
        series: [{
          reps: serie.reps,
          weight
        }]
      }

      UserStats.add({
        date: new Date(),
        weight
      })

      setWorkoutStats((v) => [...v, toAdd])

      setIsShowingModalWeight(false)
      setIsShowingModalTimer(true)
      return
    }

    const toAdd: Stats = {
      exerciseId: toDoExercise.exercise._id!,
      series: [...exerciseSeries, {
        reps: serie.reps,
        weight
      }]
    }

    UserStats.add({
      date: new Date(),
      weight
    })

    setWorkoutStats((v) => [...v, toAdd])

    setIsShowingModalWeight(false)
    setIsShowingModalTimer(true)
  } 

  function getPercentage() {
    const exerciseIdx = exercises.findIndex(ex => ex === toDoExercise)+1
    const total = numberOfExercises*numberOfSeries
    

    return exerciseIdx/total
  }

  return (
    <View className='flex-1'>
      <View
        className='h-16 w-full bg-blue-800 justify-center p-3 flex-col space-y-2'
      >
        <View className='w-full'>
          <Text className='text-gray-50 font-medium text-center text-lg'>{toDoExercise.exercise.name}</Text>
        </View>
        <View className='flex-row w-full justify-center items-center space-x-2'>
          <Progress.Bar 
            width={200} 
            height={10} 
            color='rgb(255 255 255)' 
            borderRadius={999} 
            progress={getPercentage()} 
          />
        </View>
      </View>
      <View className='flex-1 w-full'>
        <View className='items-center mt-6'>
          <Image
            source={{ uri: toDoExercise.exercise.image }}
            width={250}
            height={250}
            style={{ borderRadius: 400 / 2 }}
          />
        </View>
        <View className='items-center mt-4 space-y-2'>
          <View className='space-y-2'>
            <Text className='text-2xl font-semibold'>{serie.number}° Serie</Text>
            <Text className='text-md font-medium'>Repetições: {serie.reps}</Text>
          </View>
        </View>
        <View className='flex-1 w-full items-center justify-end space-y-4'>
          <Button onPressIn={() => setIsShowingModalWeight(true)}>
            {(numberOfExercises - (exercises.findIndex(ex => ex === toDoExercise) + 1) === 0)
              ? serie.number === numberOfSeries ? 'Finalizar Treino' : 'Próxima Série'
              : serie.number === numberOfSeries ? 'Próximo exercício' : 'Próxima Série'
            }
          </Button>
          <View
            className='flex-row border-t border-gray-300 h-20 w-full mb-8 items-center justify-around p-3'
          >
            <View>
              <Button color='red' onPress={() => {
                setTabSelected({ key: 'workout', route: '/(tabs)/workouts' })
                router.replace('/(tabs)/workouts')
              }}>
                Sair
              </Button>
            </View>

          </View>
        </View>
      </View>

      <Modal isOpen={isShowingModalTimer} onClose={setIsShowingModalTimer} closeOnOverlayClick={false}>
        <Modal.Content className='items-center justify-center'>
          <Modal.Body>
            <CountdownCircleTimer
              duration={serie.restTime}
              colors={'rgb(30 64 175)'}
              isPlaying
              onComplete={() => {
                setIsShowingModalTimer(false)
                nextExercise()
              }}
            >
              {({ remainingTime }) => <View className='flex-col space-y-2'>
                <Text className='text-center'>Descanse por</Text>
                <Text className='text-center font-bold text-3xl'>{remainingTime}</Text>
                <Text className='text-center'>segundos</Text>

                <Pressable
                  className='items-end'
                  onPressIn={() => {
                    setIsShowingModalTimer(false)
                    nextExercise()
                  }}
                >
                  <Text className='text-xs text-center text-gray-400'>Pular descanso</Text>
                </Pressable>
              </View>
              }
            </CountdownCircleTimer>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal isOpen={isShowingModalWeight} onClose={setIsShowingModalWeight} closeOnOverlayClick={false}>
        <Modal.Content>
          <Modal.Header>Insira a carga utilizada nesta série</Modal.Header>
          <Modal.Body
            className='flex-col space-y-2 items-center'
          >
            <Input
              keyboardType='numeric'
              placeholder='kg'
              className='h-10 w-full border border-gray-300 rounded-lg p-2 text-center text-lg'
              onChangeText={(value) => setWeight(parseFloat(value))}
            />
            <Button
              className='h-10 w-32 p-2'
              onPressIn={handleSaveStats}
            >
              Confirmar
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View>
  )
}