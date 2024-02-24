import { ExerciseInfo } from "../@types/Workout"

export default function calcWorkoutDifficulty(exercises: ExerciseInfo[]) {
    let difficulty = 0

    for (const exercise of exercises) {
        difficulty = difficulty + exercise.exercise.difficulty
    }

    difficulty = Math.floor(difficulty / exercises.length + 1)

    return difficulty
}