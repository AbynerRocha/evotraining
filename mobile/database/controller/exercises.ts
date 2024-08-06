import AsyncStorage from "@react-native-async-storage/async-storage"
import { ExerciseData } from "../../@types/Exercise"

export class ExercisesLocalStoraged {
    private key: string

    constructor(exerciseId: string) {
        this.key = exerciseId
    }

    
    async save(exercise: ExerciseData) {
        try {
            let saveData = {
                ...exercise,
                createdBy: JSON.stringify(exercise.createdBy),
                muscles: JSON.stringify(exercise.muscles)
            }

            AsyncStorage.setItem(this.key, JSON.stringify(saveData))
        } catch (error) {
            return null   
        }
    }

    async get() {
        try {
            const storaged = await AsyncStorage.getItem(this.key)

            if (storaged === null) return null

            let data = JSON.parse(storaged)

            data = {
                ...data,
                createdBy: JSON.parse(data.createdBy),
                muscles: JSON.parse(data.muscles)
            }

            return data
        } catch (error) {
            return null
        }
    }

    async remove() {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) throw new Error('There is no data saved')

            AsyncStorage.removeItem(this.key)
            return true
        } catch (error: any) {
            throw new Error(error)
        }
    }
}
