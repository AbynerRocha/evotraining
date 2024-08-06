import { ExerciseData } from "../Exercise"
import { UserData } from "../User"

type WorkoutData = {
    _id: string
    name: string
    saves: number
    createdAt: Date
    createdBy: UserData
    exercises: ExerciseInfo[]
    lastEdit?: Date
    isPrivate: boolean
}

type ExerciseInfo = {
    exercise: ExerciseData,
    series: {
        reps: number,
        restTime: number
    }[]
}

type ExerciseRecordUser = {
    weight: number
    date: Date
}


export {
    WorkoutData,
    ExerciseInfo,
    ExerciseRecordUser
}