
import { Schema, model } from 'mongoose'
import { UserData } from '../../@types/User'
import { WorkoutSchema } from './Workouts'

export const userSchema = new Schema<UserData>({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String },
    avatar: { type: String, required: false },
    accessLevel: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, defualt: Date.now() },
    verified: { type: Boolean, default: false },
    emailCode: { type: String }
})

const UserSavedWorkoutsSchema = new Schema({
    userId: { type: String, ref: 'users' },
    workout: { type: String, ref: 'workouts' }
})

const ExerciseStatsSchema = new Schema({
    userId: { type: String, ref: 'users' },
    data: {
        type: [{
            exercise: { type: String, ref: 'exercises' },
            stats: [{
                date: { type: Date, default: new Date() },
                reps: Number,
                weight: Number
            }]
        }]
    }
})

const UserWorkoutsHistorySchema = new Schema({
    user: { type: String, ref: 'users' },
    workout: { type: String, ref: 'workouts' },
    date: { type: Date, default: new Date() }
})

const UserTrainingPlanSchema = new Schema({
    user: { type: String, ref: 'users' },
    name: { type: String },
    createdAt: { type: Date, default: new Date() },
    plan: { type: [{ 
        restDay: { type: Boolean, default: false },
        workout: { type: String || undefined, ref: 'workouts' },
        weekDay: { type: String }
    }] }
})


const User = model('users', userSchema)
const UserExerciseStats = model('user_exercise_stats', ExerciseStatsSchema)
const UserSavedWorkouts = model('user_saved_workouts', UserSavedWorkoutsSchema)
const UserWorkoutsHistory = model('user_workouts_history', UserWorkoutsHistorySchema)
const UserTrainingPlan = model('user_training_plans', UserTrainingPlanSchema)

export { User, UserSavedWorkouts, UserExerciseStats, UserWorkoutsHistory, UserTrainingPlan }