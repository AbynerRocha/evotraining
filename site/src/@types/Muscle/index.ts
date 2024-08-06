import { UserData } from "../User"

export type MuscleData = {
    _id: string
    name: string
    createdBy: UserData
    createdAt: Date
}