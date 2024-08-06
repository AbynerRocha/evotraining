import { MuscleData } from "../Muscle"
import { UserData } from "../User"

export type ExerciseData = {
    _id?: string
    name: string
    muscles: MuscleData[]
    difficulty: number
    image: string
    createdBy: UserData
}