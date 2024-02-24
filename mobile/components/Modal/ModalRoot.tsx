
import { View, Text } from 'react-native'
import React, { Children, useEffect } from 'react'
import ModalHeader from './ModalHeader'
import ModalFooter from './ModalFooter'
import { MotiView } from 'moti'
import { useApp } from '../../contexts/App/AppContext'
import BgTranslucent from './BgTranslucent'

type ModalRootProps = {
  children: React.ReactElement<typeof ModalHeader>[] | React.ReactElement<typeof ModalFooter>[]
  show: boolean
}

export default function ModalRoot({ children, show }: ModalRootProps) {
  const { setBGTranslucent } = useApp()

  const childrenArray = Children.toArray(children)

  const Header = childrenArray.filter((child) => {
    return React.isValidElement(child) && child.type === ModalHeader
  })
  
  const Footer = childrenArray.filter((child) => {
    return React.isValidElement(child) && child.type === ModalFooter
  })

  useEffect(() => {
    setBGTranslucent(show === true ? 'show' : 'hide')
  }, [show])

  return (
    <View className='abosolute top-0 items-center justify-center'>
      <MotiView
        className='h-72 w-72 rounded-xl bg-gray-50 p-4 shadow-md shadow-black'
        
      >

      </MotiView>
    </View>
  )
}