import { WorkoutData } from "../Workout"

export type UserData = {
    _id: string
    name: string
    email: string
    avatar?: string
    accessLevel: 1 | 2 | 3
    createdAt: Date
    verified: boolean
}

export type HistoryData = {
    workout: WorkoutData,
    date: Date
}

export type UserTrainingPlanData = {
    _id: string,
    name: string,
    createdAt: Date, 
    user: string,
    plan: {
        restDay: boolean,
        weekDay: string,
        workout: WorkoutData | null
    }[]
}
