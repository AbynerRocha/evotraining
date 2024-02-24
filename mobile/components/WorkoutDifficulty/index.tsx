import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'

type Props = {
  difficulty: number
  className?: string
  invertColor?: boolean
  colors?: string[]
  size?: number
}

export default function WorkoutDifficulty({ className, difficulty, invertColor=false, colors = ['black', 'rgb(212 212 212)'], size=13 }: Props) {
  if(colors.length !== 2) throw new Error('The color param only can be an array with 2 elements')

  function renderDifficulty() {
    let maxDifficulty = 5
    let tempDifficulty = difficulty

    const JSX: React.ReactNode[] = []

    const [color1, color2] = colors

    while (maxDifficulty != 0) {
      if (tempDifficulty > 0) {
        JSX.push(<FontAwesome5 key={maxDifficulty} name="dumbbell" size={size} color={invertColor ? color2 : color1} />)
        tempDifficulty = tempDifficulty - 1
        maxDifficulty = maxDifficulty - 1
      } else {
        JSX.push(<FontAwesome5 key={maxDifficulty} name="dumbbell" size={size} color={invertColor ? color1 : color2} />)
        maxDifficulty = maxDifficulty - 1
      }
    }

    return JSX
  }

  return <View
    className={className}
  >
    {renderDifficulty()}
  </View>
}