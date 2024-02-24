import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseInfo, ExerciseRecordUser, WorkoutData } from "../../@types/Workout";
import { LocalStorageKeys } from "../keys";
import { ExercisesLocalStoraged } from "./exercises";

export type WorkoutLocalStorageData = WorkoutData & {}

export type HistoryLocalStorageData = {
    date: Date
    workout: WorkoutData
}


class WorkoutLocalStoraged {
    private key: string

    constructor() {
        this.key = LocalStorageKeys.WORKOUT.WORKOUTS_SAVED
    }

    async save(workout: WorkoutData) {
        try {
            const data = await AsyncStorage.getItem(this.key)

            let dataToSave = {
                ...workout,
                // createdBy: JSON.stringify(workout.createdBy),
                exercises: this.workoutExercisesId(workout.exercises),
            }

            if (data === null) {
                AsyncStorage.setItem(this.key, JSON.stringify([dataToSave]))
                return
            }

            const workouts = JSON.parse(data)

            if (workouts.find((w: WorkoutData) => w._id === workout._id)) throw new Error('Este exercício já está salvo.')

            workouts.push(dataToSave)

            AsyncStorage.setItem(this.key, JSON.stringify({ workouts }))
            return true
        } catch (error: any) {
            throw new Error(error)
        }

    }

    async remove(workoutId: string) {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) throw new Error('There is no data saved')

            const workouts: WorkoutLocalStorageData[] = JSON.parse(data)
            const filtered = workouts.filter(w => w._id !== workoutId)

            AsyncStorage.removeItem(this.key)
            AsyncStorage.setItem(this.key, JSON.stringify(filtered))
            return true
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async get() {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) return null

            const workouts = JSON.parse(data)
            let workoutsData = []

            for(const workout of workouts) {
                let exercises = []

                for(const exercise of workout.exercises) {
                    const ExerciseStoraged = new ExercisesLocalStoraged(exercise)

                    exercises.push(await ExerciseStoraged.get())
                }

                workoutsData.push({
                    ...workout,
                    // createdBy: JSON.parse(workout.createdBy),
                    exercises
                })
            }

            return workoutsData as WorkoutData[]
        } catch (error: any) {
            throw new Error(error)
        }
    }

    private workoutExercisesId(exercises: ExerciseInfo[]) {
        let ids = []

        for(const exercise of exercises) {
            ids.push(exercise.exercise._id)
        }

        return ids
    }
}

class UserExerciseStats {
    private key: string

    constructor(exerciseId: string) {
        this.key = exerciseId
    }


    public async get() {
        try {
            const storaged = await AsyncStorage.getItem(this.key)

            if (storaged === null) return null

            const data: ExerciseRecordUser[] = JSON.parse(storaged)

            return data
        } catch (error) {
            return null
        }
    }

    public async add(data: ExerciseRecordUser) {
        try {
            const storaged = await this.get()

            if (storaged === null) {
                AsyncStorage.setItem(this.key, JSON.stringify([{ ...data }]))
                return
            }

            AsyncStorage.removeItem(this.key)
            AsyncStorage.setItem(this.key, JSON.stringify([...storaged, { ...data }]))
        } catch (error) {
            return null
        }
    }
}

export {  WorkoutLocalStoraged, UserExerciseStats }
