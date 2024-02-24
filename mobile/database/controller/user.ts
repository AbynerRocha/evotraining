import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageKeys } from "../keys";
import { UserData } from "../../@types/User";

export type UserLocalStorageData = {
    user: UserData
    refreshToken: string
    authToken: string
}

const userKey = LocalStorageKeys.USER

export async function haveAnyDataStorage(key: string) {
    try {
        const data = await AsyncStorage.getItem(key)

        if(data === null) return false

        return true
    } catch (error) {
        return false
    }
}

export async function getUserDataStoraged() {
    try {
        const data = await AsyncStorage.getItem(userKey)
        if(data === null) return null
        
        const userLocalData: UserLocalStorageData = JSON.parse(data)

        return userLocalData
    } catch (error: any) {
        throw new Error(error)
    }
}

export async function saveUserDataToStorage(data: UserLocalStorageData) {
    try {
        AsyncStorage.setItem(userKey, JSON.stringify(data))

        return true
    } catch(error: any) {
        throw new Error(error)
    }
}

export async function deleteUserDataFromStorage() {
    try {
        AsyncStorage.removeItem(userKey)

        return true
    } catch(error: any) {
        throw new Error(error)
    }
}
