import { UserData } from "../User"

export type MuscleData = {
    _id: string
    name: string
    createdAt: Date
    createdBy: UserData
}