import { ExerciseData } from "../Exercise/Index"
import { UserData } from "../User"

type WorkoutData = {
    _id: string
    name: string
    saves: number
    createdAt: Date
    createdBy: UserData
    exercises: {
        exercise: ExerciseData,
        series: {
            reps: number,
            restTime: number
        }[]
    }[]
    lastEdit?: Date
    isPrivate: boolean
}

export default WorkoutData