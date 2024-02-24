import { View, Text, Pressable, Vibration } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/Auth/AuthContext';
import { Link, useRouter } from 'expo-router';
import Avatar from '../Avatar';
import { useApp } from '../../contexts/App/AppContext';

export default function Header() {
    const userHour = new Date().getHours()
    const { user } = useAuth()
    const { tab, setTabSelected } = useApp()
    const router = useRouter()

    return (
        <View className='w-full h-20 flex-row items-center space-x-3'>
            {user ? <>
                <Pressable
                    className='w-14 h-14 rounded-full bg-gray-200 items-center justify-center ml-4 mt-5'
                    onLongPress={() => {
                        Vibration.vibrate(250)
                        router.push('/workout/start/65cea356549b5a73f99af0f8')

                    }}
                >
                    <Avatar uri={user.avatar} fallback={{ userName: user.name }} size='lg' />
                </Pressable>
                <View className='mt-4'>
                    <Text className='text-gray-900 text-md text-lg'>{
                        userHour > 5 && userHour < 12
                            ? 'Bom dia,' : userHour >= 12 && userHour <= 18
                                ? 'Boa Tarde,' : 'Boa noite,'
                    }</Text>
                    <View className='flex-row space-x-1 items-center'>
                        <Text className='text-gray-900 text-xl font-bold'>{user.name.includes(" ") ? user.name.split(' ')[0] : user.name}</Text>
                        {user.verified === false && <Pressable
                            onPress={() => {
                                setTabSelected({ key: 'settings', route: '/(tabs)/settings' })
                                router.push('/(tabs)/settings')
                            }}
                        >
                            <Ionicons name="alert-circle" size={20} color="red" />
                        </Pressable>}
                    </View>
                </View>
            </> 
            : 
            <View className='h-full w-screen flex-row items-center  px-4 space-x-2'>
                <Link
                    className='bg-blue-800 py-3 px-5 rounded-xl'
                    href='/(auth)/landingpage'
                >
                    <Text className='text-gray-50 font-semibold'>Entrar</Text>
                </Link>
            </View>
            }

        </View>
    )
}