import { View, Text, Vibration } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Slot } from 'expo-router'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import { useNetInfo } from '@react-native-community/netinfo'
import { AlertDialog, useDisclose } from 'native-base'
import { Feather } from '@expo/vector-icons'
import { useExerciseStore } from '../../utils/states/exercises'


export default function TabsLayout() {
  const { isConnected } = useNetInfo()
  const { isOpen, onOpen, onClose } = useDisclose()
  const alertConnectionRef = useRef(null)

  const { exercises, setExercisesData } = useExerciseStore()

  useEffect(() => {
    if(!isConnected) {
      onOpen()
    }

    if(isOpen && isConnected) {
      onClose()
    }
  
  }, [isConnected])

  if(exercises.length !== 0) {
    setExercisesData([])
  }

  return (
    <View className='h-full w-full'>
      <Header />
      <Navbar />
      <Slot/>

      <AlertDialog  
        isOpen={isOpen}
        leastDestructiveRef={alertConnectionRef}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Sem Conexão</AlertDialog.Header>
          <AlertDialog.Body className='flex-col space-y-2 items-center'>
            <View>
              <Feather name='wifi-off' size={40} color='blue' />
            </View>
            <View>
              <Text className='text-center'>Para continuar a utilizar a aplicação, você precisa ter acesso a internet.</Text>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  )
}