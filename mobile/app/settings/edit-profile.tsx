import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import * as Progress from 'react-native-progress';
import Button from '../../components/Button'
import { useMediaLibraryPermissions, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { Api } from '../../utils/Api'
import axios from 'axios'
import { MotiView, useAnimationState } from 'moti'

export default function EditProfile() {
  const { user } = useAuth()
  const router = useRouter()

  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0.5)

  const [permission, getPermission] = useMediaLibraryPermissions()
  const [newAvatar, setNewAvatar] = useState<string>('')
  const [success, setSuccess] = useState<null | boolean>(null)

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/landingpage')
      return
    }
  }, [])

  useEffect(() => {
    if (success === null) return

    uploadStateAnim.transitionTo(success ? 'success' : 'error')
  }, [success])

  const uploadStateAnim = useAnimationState({
    from: {
      backgroundColor: 'rgb(71 85 105)',
      opacity: 0
    },
    success: {
      backgroundColor: '#00ff00',
      opacity: 1
    },
    error: {
      backgroundColor: '#ff0000',
      opacity: 1
    }
  })

  async function fetchImageFromUri(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  async function handleChangeAvatar() {
    if (permission?.granted === false && permission.canAskAgain) {
      getPermission()
    }

    const { assets, canceled } = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      selectionLimit: 1
    })

    if (canceled || assets.length === 0) return

    setAvatarUploadProgress(0)

    const fileSelected = assets[0]
    const fileName = fileSelected.uri.substring(fileSelected.uri.lastIndexOf('/') + 1, fileSelected.uri.length)
    const image = await fetchImageFromUri(fileSelected.uri)

    const formData = new FormData()
    formData.append('file', image)

    Api.post('/upload/user-avatar', formData, {
      onUploadProgress: (progressEvent) => {
        console.warn(progressEvent)
        if (!progressEvent.progress) return

        setAvatarUploadProgress(progressEvent.progress)
      }
    })
    .then((res) => {
      console.warn('aa')
      setSuccess(true)
    })
    .catch((err) => {
      console.error(err)
      setSuccess(false)
    })
  }

  return (
    <View className='flex-1'>
      <View className='w-full items-center mt-5'>
        <View className='w-fit h-fit rounded-full'>
          <Pressable className='w-full h-fit' onPress={handleChangeAvatar}>
            <Progress.Circle
              color='#00ff00'
              borderWidth={0.1}
              size={105}
              progress={avatarUploadProgress}
              className='w-50 h-50 absolute -top-[2.3px] -left-[2px]'
            />
            <Avatar
              uri={user?.avatar}
              fallback={{ userName: user?.name }}
              size={100}
              className='tems-center justify-center bg-blue-800'
              textClass='text-4xl'
            />
          </Pressable>
        </View>
        <Text className='text-2xl font-medium'>{user?.name}</Text>
        <Button className='mt-5' size='sm'>Teste</Button>
      </View>
    </View>
  )
}