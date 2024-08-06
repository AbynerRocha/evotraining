import { Schema, Types, model } from "mongoose";
import { User, userSchema } from "./User";
import { MuscleSchema } from "./Muscles";

export const ExerciseSchema = new Schema({
    name: { type: String, required: true },
    muscles: { type: [String], required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    image: { type: String, required: true },
    createdAt: { type: String, default: new Date() },
    createdBy: { type: String, required: true }
})

const Exercise = model('exercises', ExerciseSchema)

export { Exercise }