import { Schema, model } from "mongoose";
import { userSchema } from "./User";

export const MuscleSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    createdBy: { type: String }
})

export const Muscle = model('muscles', MuscleSchema)