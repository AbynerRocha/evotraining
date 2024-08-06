import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, Pressable, Vibration, Alert, ActivityIndicator, Share } from 'react-native'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Api } from '../../utils/Api'
import { WorkoutData } from '../../@types/Workout'
import { AxiosError, AxiosResponse } from 'axios'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import { FontAwesome, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Actionsheet, AlertDialog, useClipboard, useDisclose, useToast } from 'native-base'
import { Link, useRouter } from 'expo-router'
import Button from '../../components/Button'
import QRCode from 'react-native-qrcode-svg';
import config from '../../app.json'
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import ErrorPage from '../error'
import { useApp } from '../../contexts/App/AppContext'

type Response = {
  workouts: WorkoutData[]
}

export default function UserWorkouts() {
  const { user } = useAuth()
  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })

  const [page, setPage] = useState(1)
  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutData>()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState({ type: '', message: '' })

  const actionSheet = useDisclose()
  const alertDialog = useDisclose()
  const dialogQrCode = useDisclose()
  const actionSheetShare = useDisclose()

  const cancelAlertDialogRef = useRef(null)
  const cancelQRCodeDialogRef = useRef(null)
  const router = useRouter()

  const clipboard = useClipboard()
  const toast = useToast()

  const { tab, setTabSelected } = useApp()

  useEffect(() => {
    if(tab !== 'user_workouts') setTabSelected({ 
      key: 'user_workouts',
      route: '/(tabs)/user_workouts'
    })

    fetchWorkout()
  }, [])

  function fetchWorkout() {
    setIsFetching(true)

    Api.get('/workout', {
      params: {
        pvts: true, 
        cb: user?._id
      }
    })
      .then((res: AxiosResponse<Response>) => {
        setWorkouts(res.data.workouts)
      })
      .catch((err: AxiosError<any>) => {
        console.error(err.response?.data)
        switch (err.response?.data) {
          case 'PAGE_NOT_FOUND' || 'NOT_FOUND': 
            setError({ type: '', message: '' })
            break
          default:
            setError({ type: 'root', message: `Não foi possivel realizar esta ação neste momento (${err.code})` })
            break
        }
      })
      .finally(() => setIsFetching(false))
  }

  function handleDeleteWorkout() {
    Api.delete(`/workout?id=${workoutSelected?._id}`)
      .then(() => {
        fetchWorkout()

        alertDialog.onClose()
        actionSheet.onClose()

        setWorkoutSelected(undefined)
      })
  }

  if (isFetching) return <View className='h-screen w-screen items-center justify-center bg-gray-50'>
    <ActivityIndicator size='large' color='black' />
  </View>

  if (error.type !== '' && error.type === 'root') return <ErrorPage message='Não foi possivel realizar esta ação neste momento.' />
  
  return <View className='flex-1'>
    <ScrollView className='flex-1'>
      {workouts.map((workout, idx) => {
        const difficulty = calcWorkoutDifficulty(workout.exercises)

        return <Pressable
          onLongPress={() => {
            Vibration.vibrate(150)
            setWorkoutSelected(workout)

            actionSheet.onOpen()
          }}
          key={idx}
          className='m-3 h-20 p-2 rounded-lg border border-gray-300'
        >
          <View className='w-full h-full justify-between'>
            <Text className='font-semibold'>{workout.name}</Text>
            <View className='flex-row space-x-1 justify-between'>
              <WorkoutDifficulty
                className='flex-row space-x-1'
                difficulty={difficulty}
              />

              <View className='flex-row items-center space-x-1'>
                <Ionicons name="cloud-download-outline" size={13} color="rgb(160 160 160)" />
                <Text className='text-xs text-gray-400'>{formatter.format(workout.saves)}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      })}
    </ScrollView>

    {user && <View>
        <Link href='/workout/create' className='absolute bottom-10 right-0 mr-3'>
          <View className='bg-blue-800 rounded-full h-16 w-16  items-center justify-center shadow-md shadow-black/50'>
            <FontAwesome name='plus' color='white' size={20} />
          </View>
        </Link>
      </View>}

    <Actionsheet isOpen={actionSheet.isOpen} onClose={() => {
      setWorkoutSelected(undefined)
      actionSheet.onClose()
    }}>
      <Actionsheet.Content>
        <View>
          <Text className='text-lg font-medium'>Gerir {workoutSelected?.name}</Text>
        </View>
        <Actionsheet.Item
          startIcon={<MaterialIcons name="open-in-new" size={19} color="gray" />}
          className='rounded-xl active:bg-gray-200 active:transition-all active:duration-300 active:ease-in-out'
          onPress={() => router.push(`/workout/${workoutSelected?._id}`)}
        >
          <Text className='font-medium'>Ver</Text>
        </Actionsheet.Item>
        <View className='w-full h-0.5 bg-gray-200 my-2' />
        <Actionsheet.Item
          startIcon={<Ionicons name='md-pencil-sharp' size={18} color='gray' />}
          className='rounded-xl active:bg-gray-200 active:transition-all active:duration-300 active:ease-in-out'
          onPress={() => router.push(`/workout/edit/${workoutSelected?._id}`)}
        >
          <Text className='font-medium'>Editar</Text>
        </Actionsheet.Item>

        <View className='w-full h-0.5 bg-gray-200 my-2' />
        <Actionsheet.Item
          startIcon={<Feather name='share' size={18} color='gray' />}
          className='rounded-xl active:bg-gray-200 active:transition-all active:duration-300 active:ease-in-out'
          onPressIn={() => actionSheetShare.onOpen()}
        >
          <Text className='font-medium'>Partilhar</Text>
        </Actionsheet.Item>
        <View className='w-full h-0.5 bg-gray-200 my-2' />
        <Actionsheet.Item
          startIcon={<Ionicons name='md-trash' size={18} color='red' />}
          className='rounded-xl active:bg-gray-200 active:transition-all active:duration-300 active:ease-in-out'
          onPress={() => {
            setWorkoutSelected(workoutSelected)

            alertDialog.onOpen()
          }}
        >
          <Text className='text-red-500 text-md font-medium'>Remover</Text>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>

    <Actionsheet
      isOpen={actionSheetShare.isOpen}
      onClose={actionSheetShare.onClose}
    >
      <Actionsheet.Content>
        <View>
          <Text className='text-lg font-medium'>Partilhar {workoutSelected?.name}</Text>
        </View>
        <Actionsheet.Item
          startIcon={<Ionicons name='qr-code' size={18} color='gray' />}
          className='rounded-xl active:bg-gray-200 active:transition-all active:duration-300 active:ease-in-out'
          onPressIn={() => dialogQrCode.onOpen()}
        >
          <Text>QR-Code</Text>
        </Actionsheet.Item>
        <View className='w-full h-0.5 bg-gray-200 my-2' />
        <Actionsheet.Item
          startIcon={<Ionicons name='clipboard-outline' size={18} color='gray' />}
          className='rounded-xl active:bg-gray-200 active:transition-all active:duration-300 active:ease-in-out'
          onPressIn={() => {
            const url = `https://evotraining.pt/redirect?ty=wrkot&tkn=${workoutSelected?._id}`

            clipboard.onCopy(url)

            Vibration.vibrate(200)

            toast.show({
              description: 'Copiado com sucesso.'
            })
          }}
        >
          <Text>Copiar URL</Text>
        </Actionsheet.Item>
        <View className='w-full h-0.5 bg-gray-200 my-2' />
        <Actionsheet.Item
          startIcon={<Feather name='more-horizontal' size={18} color='gray' />}
          className='rounded-xl active:bg-gray-200 active:transition-all active:duration-300 active:ease-in-out'
          onPressIn={() => {
            const url = `https://evotraining.pt/redirect?ty=wrkot&tkn=${workoutSelected?._id}`

            Share.share({
              message: url,
              url
            })
          }}
        >
          <Text>Outros</Text>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>

    <AlertDialog leastDestructiveRef={cancelAlertDialogRef} isOpen={alertDialog.isOpen} onClose={alertDialog.onClose}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Remover {workoutSelected?.name}</AlertDialog.Header>
        <AlertDialog.Body>
          <View>
            <Text>
              Você tem certeza que quer apagar este treino?
              {workoutSelected && workoutSelected?.saves > 0 && <><Text className='font-medium'> {workoutSelected?.saves} utilizadores</Text> já salvaram este treino</>}
            </Text>
          </View>
        </AlertDialog.Body>
        <AlertDialog.Footer className='space-x-2'>
          <Button
            className='p-0 h-10 w-16'
            onPress={handleDeleteWorkout}
          >
            Sim
          </Button>
          <Button
            className='p-0 h-10 w-16'
            color='red'
            onPress={alertDialog.onClose}
          >
            Não
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>

    <AlertDialog leastDestructiveRef={cancelQRCodeDialogRef} isOpen={dialogQrCode.isOpen} onClose={dialogQrCode.onClose}>
      <AlertDialog.Content className='flex-col p-3 items-center justify-center'>
        <AlertDialog.CloseButton />
        <AlertDialog.Body className='items-center justify-center'>
          <View>
            <QRCode
              color='black'
              value={`exp://dbjqgqg.abrocha.8081.exp.direct/--/workout/${workoutSelected?._id}`}
              size={170}
            />
          </View>
        </AlertDialog.Body>
      </AlertDialog.Content>
    </AlertDialog>


  </View>
}