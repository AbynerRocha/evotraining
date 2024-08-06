import { View, Text, PressableProps, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { tv, VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'rounded-xl items-center justify-center',
  variants: {
    color: {
      blue: 'bg-blue-800 active:bg-blue-700',
      green: 'bg-green-500 active:bg-green-400',
      red: 'bg-red-600 active:bg-red-500'
    },
    size: {
      sm: 'py-3 px-5 w-24 h-12',
      md: 'py-3 px-5 w-40 h-12',
      lg: 'py-3 px-5 w-56 h-14',
      xl: 'py-3 px-5 w-60 h-14',
      full: 'py-3 px-5, w-full h-12'
    }
  },
  defaultVariants: { size: 'md', color: 'blue' }
})

const textVariant = tv({
  base: 'font-md font-medium',
  variants: {
    text: { 
      dark: 'text-gray-50 text-md font-medium',
      light: 'text-gray-950 text-md font-medium'
    },
    textSize: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl'
    }
  },
  defaultVariants: { text: 'dark', textSize: 'md' }
})

type ButtonProps = PressableProps & VariantProps<typeof button> & VariantProps<typeof textVariant> & { 
    children: string | React.ReactNode
    textStyle?: string
    className?: string
    isLoading?: boolean
}

export default function Button({ 
  children, 
  className,
  size, 
  textStyle,
  textSize, 
  color, 
  text,
  isLoading,
  ...rest 
}: ButtonProps) {
  
  return (
    <Pressable
        className={twMerge(button({ size, color }) ,className)}
        disabled={isLoading}
        {...rest}
    >
        {!isLoading 
        ? typeof children === 'string' 
        ? <Text className={twMerge(textVariant({ text, textSize }), textStyle)}>{children}</Text> 
        : children
        : <ActivityIndicator size={20} color='white' />}
        
    </Pressable>
  )
}