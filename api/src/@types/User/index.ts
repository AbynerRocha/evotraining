import { Schema, Types } from "mongoose"
import WorkoutData from "../Workout"

export type AccessLevel = 1 | 2 | 3

export type UserData = {
    _id: Types.ObjectId
    name: string
    email: string
    password: string
    avatar?: string
    accessLevel: AccessLevel
    createdAt: Date
    verified?: boolean
    emailCode?: string
}

export type UserTrainingPlanData = {
    _id: Types.ObjectId,
    name: string,
    createdAt: Date,
    user: string,
    plan: {
        restDay: boolean,
        weekDay: string,
        workout: WorkoutData | null
    }[]
}

