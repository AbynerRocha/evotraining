import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'
import { LocalStorageKeys } from '../keys'

const deviceKey = LocalStorageKeys.DEVICE

export async function generateID() {
    const deviceId = uuid.v4().toString()

    AsyncStorage.setItem(deviceKey.ID, deviceId)
    .catch((err) => console.error(err))    
}

export async function getId() {
    let deviceId = await AsyncStorage.getItem(deviceKey.ID)

    if(deviceId === null) {
        generateID()
        deviceId = await AsyncStorage.getItem(deviceKey.ID)
    }

    return deviceId
}

export async function isFirstLaunch() {
    try {
        const hasLaunched = await AsyncStorage.getItem(deviceKey.FIRST_LAUNCH)

        if(hasLaunched === null) {
            AsyncStorage.setItem(deviceKey.FIRST_LAUNCH, 'true')
            return true
        }
        
        return false
    } catch (error) {
        return false
    }
}
