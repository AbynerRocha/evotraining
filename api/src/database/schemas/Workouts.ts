import { Schema, Types, model } from "mongoose";

export const WorkoutSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    createdBy: { type: String, required: true },
    exercises: { type: [{ exercise: String, series: Array<{ reps: number, restTime: number }> }], required: true },
    saves: { type: Number, default: 0 },
    lastEdit: { type: Date, default: null },
    isPrivate: { type: Boolean, default: false }
})

export const Workout = model('workouts', WorkoutSchema)

//