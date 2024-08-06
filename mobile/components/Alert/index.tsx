import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { MotiView, useAnimationState } from 'moti'
import { Feather } from '@expo/vector-icons'
import { VariantProps, tv } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'


const alert = tv({
  base: 'mx-10 h-fit p-3 rounded-lg',
  variants: {
    colors: {
      red: 'bg-red-500/60',
      green: 'bg-green-500/60',
      blue: 'bg-blue-600/60'
    }
  }
})

type Props = VariantProps<typeof alert> & {
  children: string
  onClose: () => void
  show: boolean
}

export default function Alert({ children, onClose, colors, show }: Props) {
  const alertAnim = useAnimationState({
    hide: {
      opacity: 0,
      bottom: -200
    },
    show: {
      opacity: 1,
      bottom: 0
    }
  }, {
    from: 'hide',
    to: 'show'
  })

  useEffect(() => {
    if(show === true) {
      alertAnim.transitionTo('show')
    }
  },[show])

  return (
    <MotiView
      className={twMerge(alert({ colors }))}
      state={alertAnim}
      transition={{
        delay: 450,
        duration: 400
      }}

    >
      <Pressable className={'h-fit w-fit flex-row items-center space-x-4'} onPress={() => {
        alertAnim.transitionTo('hide')

        setTimeout(() => onClose(), 500)
      }}>
        <View>
          <Feather name='x' color='white' size={25} />
        </View>
        <View className='break-words pr-5'>
          <Text className='text-gray-50 font-medium'>{children}</Text>
        </View>
      </Pressable>
    </MotiView>
  )
}