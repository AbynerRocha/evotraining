
import { View, Text } from 'react-native'
import React from 'react'
import { AntDesign, Feather } from '@expo/vector-icons';
import { MotiView, useAnimationState } from 'moti';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/App/AppContext';

export default function WorkoutEnd() {
  const router = useRouter()
  const { setTabSelected } = useApp()

  const animation = useAnimationState({
    from: {
      rotate: '200deg'
    },
    to: {
      rotate: '0deg'
    }
  })

  return (
    <View className='flex-1 items-center justify-center space-y-2'>
      <MotiView
        state={animation}
        transition={{
          duration: 500
        }}
      >
        <AntDesign name="checkcircle" size={55} color="blue" />
      </MotiView>
      <Text className='font-semibold text-2xl text-center mb-4'>Treino finalizado com sucesso!</Text>
      
      <View className=''>
        <Button 
          className='flex-row space-x-2 items-center justify-center' 
          size='lg'
          onPressIn={() => {
            setTabSelected({
              key: 'home',
              route:'/(tabs)/home'
            })

            router.replace('/(tabs)/home')
          }}
        >
          <Feather name='chevron-left' size={25} color='white'/>
          <Text className='text-gray-50 font-semibold'>Voltar para o inicio</Text>
        </Button>
      </View>
    </View>
  )
}
