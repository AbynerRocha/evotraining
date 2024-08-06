import React, { useEffect } from 'react'
import { useApp } from '../contexts/App/AppContext'
import { useAuth } from '../contexts/Auth/AuthContext'
import Loading from './loading'
import { generateID, isFirstLaunch } from '../database/controller/device'
import { Redirect } from 'expo-router'
import { useNetInfo } from '@react-native-community/netinfo'


export default function App() {
  const { getTabRoute} = useApp()
  const { isLoading, user } = useAuth()
  
  const { isConnected } = useNetInfo()

  useEffect(() => {
    checkIfIsFirstLaunch()
  }, [])


  if (isLoading) return <Loading />

  async function checkIfIsFirstLaunch() {
    const firstLaunch = await isFirstLaunch()

    if(firstLaunch) {
      generateID()      
    }
  }

  return isConnected && user !== null ? <Redirect href='/(tabs)/home' /> : <Redirect href='/(auth)/landingpage' />
}