import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { useQuery } from 'react-query';
import { Api } from '../../utils/Api';
import { UserTrainingPlanData } from '../../@types/User';
import CalendarDatabase from '../../database/controller/calendar';
import Button from '../../components/Button';
import getDaysOfWeek, { getWeekDayName } from '../../utils/getDaysOfWeek';
import { twMerge } from 'tailwind-merge';
import { WorkoutData } from '../../@types/Workout';
import { useApp } from '../../contexts/App/AppContext';


export default function Home() {
  const { user } = useAuth()
  const { tab, setTabSelected } = useApp()
  const router = useRouter()

  const { data: dataPlans, isLoading: isLoadingPlans, isFetching: isFetchingPlans, error } = useQuery<UserTrainingPlanData[]>({
    queryFn: async () => {
      const res = await Api.get('/user/training-plan', { params: { uid: user?._id } })

      return res.data.plans
    },
    cacheTime: 60000
  })

  const [planSelected, setPlanSelected] = useState<UserTrainingPlanData>()
  const [daySelected, setDaySelected] = useState<string>('domingo')
  const [workout, setWorkout] = useState<WorkoutData | null>(null)

  useEffect(() => {
    if(tab !== 'home') setTabSelected({ 
      key: 'home',
      route: '/(tabs)/home'
    })

    CalendarDatabase.getPlanSelected()
      .then((plan) => {
        Api.get<{ plan: UserTrainingPlanData }>('/user/training-plan', { params: { uid: user?._id, pid: plan } })
          .then((res) => {
            setPlanSelected(res.data.plan)

            setDaySelected(res.data.plan.plan[0].weekDay)
            setWorkout(res.data.plan.plan[0].workout)
          })
          .catch((err) => {
            if (err.response.data.error === 'NOT_FOUND') {
              CalendarDatabase.delete()
              return
            }
          })
      })
  }, [])

  function handleSelectDay(weekDay: string, newWorkout: WorkoutData | null) {
    if(daySelected === weekDay) return 

    setDaySelected(weekDay)

    setWorkout(newWorkout)
  }

  const Calendar = () => {
    if (isLoadingPlans || isFetchingPlans) return <View className='w-full justify-center mt-10'><ActivityIndicator size='large' color='black' /></View>

    return !dataPlans || dataPlans?.length === 0 || error
      ? <View className='mx-4 space-y-2'>
        <Text className='text-lg font-medium text-gray-900'>Sugestão de treino para iniciantes</Text>

        <View className='flex-row space-x-2 h-24 items-center justify-around'>
          <View className='bg-blue-800 rounded-2xl h-full w-54 p-3 items-center justify-center'>
            <Text className='text-gray-100 font-medium italic text-xl'>Plano de Treino Full-Body</Text>
          </View>
          <Pressable
            className='w-20 h-full bg-blue-800 rounded-2xl p-3 items-center space-y-2'
            onPress={() => router.push('/calendar/create')}
          >
            <Text className='text-gray-50 font-semibold'>Criar</Text>
            <Feather name='edit' size={28} color='white' />
          </Pressable>
        </View>
      </View>
      : <View className='flex-1 items-center'>
        {planSelected
          ? <View className='mt-4'>
            <View className='flex-row justify-between mx-3 mb-3 items-center'>
              <Text className=' font-medium text-lg'>{planSelected.name.length > 25 ? planSelected.name.slice(0, 22) + '...' : planSelected.name}</Text>
              <Pressable
                className='flex-row space-x-2 items-center p-2 rounded-xl'
                onPress={() => router.push('/calendar/select')}
              >
                <Text>Trocar</Text>
                <Feather name='edit' color='black' size={20}/>
              </Pressable>
            </View>
            <View className='h-20'>
              <ScrollView horizontal className='space-x-1 h-20'>
                {planSelected.plan.map((plan, idx) => {
                  const weekDayName = getWeekDayName(plan.weekDay)

                  return <Pressable 
                    key={idx} 
                    className={twMerge(
                      'mx-2 rounded-full bg-transparent border border-blue-800 w-16 h-16 items-center justify-center p-0.5',
                      (daySelected === plan.weekDay && 'bg-blue-800 border') 
                    )}
                    onPress={() => handleSelectDay(plan.weekDay, plan.workout)}

                  >
                    <Text className={twMerge(
                      'font-semibold',
                      (daySelected === plan.weekDay && 'text-gray-50') 
                    )}>{weekDayName}</Text>
                  </Pressable>
                })}
              </ScrollView>

            </View>
            <View className='flex-1 mt-2 items-center '>
              {workout && workout !== null ? <Pressable 
                className='bg-blue-800 h-24 w-[85%] rounded-xl flex-row justify-between items-center p-3'
                onPress={() => router.push(`/workout/${workout._id}`)}
              >
                <View className='h-full w-[80%] justify-center ml-3'>
                  <Text className='text-gray-50 text-2xl font-medium italic'>{workout.name.length > 30 ? workout.name.slice(0, 30)+'...' : workout.name}</Text>
                  <Text className='text-gray-50'>{workout.exercises.length} exercícios</Text>
                </View>
                <View>
                  <Feather name='chevron-right' size={25} color='white' />
                </View>
              </Pressable>
            : <View className='bg-blue-800 h-24 w-[85%] mx-5 rounded-xl justify-center items-center p-3'>
              <Text className='text-gray-50 text-2xl font-semibold italic'>Descanso</Text>
            </View>
            }
            </View>
          </View>
          : <View className='flex-1 w-full items-center mt-12'>
            <Button size='xl' onPress={() => router.push('/calendar/select')}>
              <View className='w-full h-full flex-row items-center space-x-2'>
                <Feather name='external-link' color='white' size={18} />
                <Text className='text-gray-50 font-medium'>Selecionar Plano de Treino</Text>
              </View>
            </Button>
          </View>
        }
      </View>
  }

  return (
    <View className='flex-1 space-y-3' >
      <View className='ml-4 w-[88%]'>
        <Text className='text-3xl font-bold text-gray-950'>Organize os seus Treinos e acompanhe a sua Evolução</Text>
      </View>

      <Calendar />
    </View>
  )
}