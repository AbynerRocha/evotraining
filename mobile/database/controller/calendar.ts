import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageKeys } from "../keys";
import { UserTrainingPlanData } from "../../@types/User";

const key = LocalStorageKeys.CALENDAR.SELECTED

export default class CalendarDatabase {
    static getPlanSelected() {
        return new Promise<string | null>(async (resolve, reject) => {
            try {
                const data = await AsyncStorage.getItem(key)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }

    static setPlan(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const hasData = await AsyncStorage.getItem(key)

                if(hasData) {
                    AsyncStorage.removeItem(key)
                }

                AsyncStorage.setItem(key, id)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    static delete() {
        return new Promise(async (resolve, reject) => {
            try {
                const hasData = await AsyncStorage.getItem(key)

                if(hasData === null) {
                    reject('Has not data')
                }

                AsyncStorage.removeItem(key)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }
}
