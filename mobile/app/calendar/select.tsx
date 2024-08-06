import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { useQuery } from 'react-query'
import { Api } from '../../utils/Api'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { UserTrainingPlanData } from '../../@types/User'
import Loading from '../loading'
import ErrorPage from '../error'
import dayjs from 'dayjs'
import CalendarDatabase from '../../database/controller/calendar'
import { Modal, useDisclose } from 'native-base'
import Button from '../../components/Button'


export default function SelectPlan() {
  const { user } = useAuth()
  const [nextPage, setNextPage] = useState(null)
  const [planSelected, setPlanSelected] = useState<UserTrainingPlanData>()
  const [selected, setSelected] = useState<UserTrainingPlanData>()
  const alertModal = useDisclose(false)

  const { data, isFetching, isLoading, error, isRefetching, refetch } = useQuery<UserTrainingPlanData[]>({
    queryFn: async () => {
      const res = await Api.get<{ plans: UserTrainingPlanData[] }>('/user/training-plan', { params: { uid: user?._id, li: 10 } })

      const plan = await CalendarDatabase.getPlanSelected()

      if (plan) setPlanSelected(res.data.plans.find(p => p._id === plan))

      return res.data.plans
    }
  })

  if (isFetching || isLoading) return <Loading />
  if (error) return <ErrorPage message='Não foi possivel realizar esta ação neste momento.' />


  async function handleSelect(plan: UserTrainingPlanData, replace?: boolean) {
    const hasData = await CalendarDatabase.getPlanSelected()

    if (hasData !== null && !replace) {
      setSelected(plan)
      alertModal.onOpen()
      return
    }

    CalendarDatabase.setPlan(plan._id)
    router.replace('/(tabs)/home')
  }

  return (
    <View className='flex-1 w-full'>
      <View className='flex-row items-center mt-2'>
        <Link href='/(tabs)/home' className='px-3 py-1'>
          <Feather name='chevron-left' size={30} color='black' />
        </Link>
        <View className='flex-1 items-center mr-4'>
          <Text className='text-xl font-semibold text-center'>Selecionar Plano de Treino</Text>
        </View>
        <Link href='/calendar/create' className='pr-3 py-1'>
          <Feather name='plus' size={30} color='black' />
        </Link>
      </View>

      <FlatList
        data={data}
        className='mt-5'
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        renderItem={({ item, index }) => {
          return <>
            <Pressable
              className='flex-row space-x-5 px-3 my-3 items-center h-20'
              android_ripple={{ color: 'rgb(243 244 246)' }}
              onPress={() => handleSelect(item)}
            >
              <View>
                <View className='bg-blue-700 rounded-full p-3 w-14 h-14 items-center justify-center'>
                  <Feather name='calendar' color='white' size={24} />
                </View>
              </View>
              <View className='flex-col items-start'>
                <View>
                  <Text className='font-medium'>{item.name}</Text>
                </View>
                <View>
                  <Text className='text-xs text-gray-400'>{dayjs(item.createdAt).format('[Criado em] DD [de] MMMM [de] YYYY')}</Text>
                </View>
              </View>
            </Pressable>
            {index !== data?.length! - 1 && <View className='w-full h-[1px] bg-gray-300' />}
          </>
        }}
      />

      <Modal isOpen={alertModal.isOpen} onClose={alertModal.onClose} size='lg'>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Substituir plano de treino</Modal.Header>
          <Modal.Body>
            <Text>Você quer substituir o treino salvo {`(${planSelected?.name})`} por este plano de treino?</Text>
          </Modal.Body>
          <Modal.Footer className='space-x-2'>
            <Button size='sm' onPress={() => handleSelect(selected!, true)}>Sim</Button>
            <Button size='sm' color='red' onPress={alertModal.onClose}>Não</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  )
}