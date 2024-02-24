import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useQuery } from 'react-query'
import { Api } from '../../utils/Api'
import { UserTrainingPlanData } from '../../@types/User'
import Loading from '../loading'
import ErrorPage from '../error'
import { Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'
import dayjs from 'dayjs'
import { RefreshControl } from 'react-native'
import { AlertDialog, Divider, Menu, useDisclose } from 'native-base'
import Button from '../../components/Button'

type Response = {
  plans: UserTrainingPlanData[],
  nextPage: number | null
}

export default function TrainingPlans() {
  const { user } = useAuth()

  const [nextPage, setNextPage] = useState<number | null>(null)
  const [data, setData] = useState<UserTrainingPlanData[]>([])
  const [planSelected, setPlanSelected] = useState<UserTrainingPlanData | null>(null)
  const [error, setError] = useState<{ error: string, message: string, type: 'root' | 'delete' } | undefined>()

  const alertRemove = useDisclose()
  const alertRemoveRef = useRef(null)
  
  const alertError = useDisclose()
  const alertErrorRef = useRef(null)

  const { isFetching, isLoading, isRefetching, refetch } = useQuery({
    queryFn: () => {
      Api.get<Response>('/user/training-plan', { params: { uid: user?._id, li: 10 } })
      .then((res) => {
        setNextPage(res.data.nextPage)
        setData(res.data.plans)
      })
      .catch((err) => {
        setError({ ...err.response.data, type: 'root' })
      })

      return true
    }
  })

  if (isFetching || isLoading) return <Loading />
  if (error?.type === 'root') return <ErrorPage message={error.message} />

  async function fetchNextPage() {
    if (nextPage === null) return

    const res = await Api.get<Response>('/user/training-plan', { params: { uid: user?._id, li: 10, p: nextPage } })

    setNextPage(res.data.nextPage)
    setData((v) => [...v, ...res.data.plans])
  }

  function handleRemove() {
    if(planSelected === null) return 

    Api.delete('/user/training-plan', { params: { id: planSelected._id }})
    .then(() => {
      alertRemove.onClose()
      setPlanSelected(null)

      refetch()
    })
    .catch((err) => {
      setError({
        ...err.response.data,
        type: 'delete'
      })
      alertError.onOpen()
    })
  }

  return (
    <View className='flex-1'>
      <View className='flex-row items-center mt-2'>
        <Link href='/(tabs)/settings' className='px-3 py-1'>
          <Feather name='chevron-left' size={30} color='black' />
        </Link>
        <View className='flex-1 items-center mr-7'>
          <Text className='text-xl font-semibold'>Planos de Treino</Text>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        renderItem={({ item, index }) => {
          return <>
            <View
              className='flex-row space-x-5 px-3 my-3 items-center h-20'
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

              <Menu
                trigger={triggerProps => {
                  return <View key={index} className='flex-1 items-end'>
                    <Pressable {...triggerProps} className='px-2 py-1'>
                      <Feather name='more-horizontal' size={22} />
                    </Pressable>
                  </View>
                }}
                className='mr-5'
              >
                <Menu.Item
                  android_ripple={{ color: 'rgb(229 231 235)' }}
                  className='active:bg-transparent'
                >
                  <Feather name='edit-2' color='black' size={15} />
                  <Text>Editar</Text>
                </Menu.Item>
                <Divider />
                <Menu.Item
                  android_ripple={{ color: 'rgb(229 231 235)' }}
                  className='active:bg-transparent'
                  onPress={() => {
                    setPlanSelected(item)
                    alertRemove.onOpen()
                  }}
                >
                  <Feather name='trash' color='red' size={15} />
                  <Text className='text-red-600'>Remover</Text>
                </Menu.Item>
              </Menu>
            </View>
          </>
        }}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.1}
        ListFooterComponent={nextPage !== null ? <ActivityIndicator size='small' color='black' className='mt-3' /> : null}
      />

      <AlertDialog
        leastDestructiveRef={alertErrorRef}
        isOpen={alertError.isOpen}
        onClose={() => {
          setPlanSelected(null)
          alertError.onClose()
        }}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Ocorreu um erro</AlertDialog.Header>

          <AlertDialog.Body>
            <ErrorPage message={error ? error?.message : 'Não foi possivel deletar este plano de treino.'} />
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
      <AlertDialog
        leastDestructiveRef={alertRemoveRef}
        isOpen={alertRemove.isOpen}
        onClose={() => {
          setPlanSelected(null)
          alertRemove.onClose()
        }}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{planSelected?.name}</AlertDialog.Header>

          <AlertDialog.Body>
            <Text>Você realmente quer apagar {planSelected?.name}?</Text>
          </AlertDialog.Body>

          <AlertDialog.Footer className='justify-around items-center'>
            <Button
              size='sm'
              onPress={handleRemove}
            >
              Sim
            </Button>
            <Button
              size='sm'
              color='red'
              onPress={() => {
                setPlanSelected(null)
                alertRemove.onClose()
              }}
            >
              Não
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  )
}