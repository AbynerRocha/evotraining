import { QueryOptions, Types } from "mongoose";
import WorkoutData from "../../@types/Workout";
import { Workout } from "../../database/schemas/Workouts";
import { User } from "../../database/schemas/User";
import { Exercise } from "../../database/schemas/Exercises";
import { getUser } from "../Users";

export default class WorkoutController {

    static async get(filter: WorkoutData, options: QueryOptions<any>) {
        const workouts = await Workout.find(filter, {}, options)

        let workoutData = []

        for (const workout of workouts) {
            const creator = await getUser({ _id: new Types.ObjectId(workout.createdBy) })
            const exercises = []

            for (const exerciseData of workout.exercises) {
                const data = await Exercise.findById(exerciseData.exercise)
                exercises.push({ exercise: data, series: exerciseData.series })
            }

            workoutData.push({
                _id: workout._id,
                name: workout.name,
                createdAt: workout.createdAt,
                createdBy: creator,
                saves: workout.saves,
                lastEdit: workout.lastEdit,
                exercises,
                isPrivate: workout.isPrivate
            })
        }

        return workoutData as unknown as WorkoutData
    }

    static async getById(id: string) {
        const workout = await Workout.findById(id)
        
        if(workout === null) return null

        const creator = await getUser({ _id: new Types.ObjectId(workout.createdBy) })
        const exercises = []

        for(const exerciseData of workout.exercises) {
            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, series: exerciseData.series })
        }

        let workoutData = {
            _id: workout._id.toString(),
            name: workout.name,
            createdAt: workout.createdAt,
            createdBy: creator,
            saves: workout.saves,
            lastEdit: workout.lastEdit,
            exercises,
            isPrivate: workout.isPrivate
        }

        return workoutData as unknown as WorkoutData
    }
}