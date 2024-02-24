import { create } from 'zustand'
import { ExerciseInfo } from '../../../@types/Workout'
import { ExerciseData } from '../../../@types/Exercise'

export const useExercisesStore = create<{ exercises: ExerciseInfo[], setExercisesData: (data: ExerciseInfo[]) => void }>((set) => (
    {
        exercises: [],
        setExercisesData: (data: ExerciseInfo[]) => set({ exercises: data })
    }
))

export const useExerciseStore = create<{ exercises: ExerciseData[], setExercisesData: (data: ExerciseData[]) => void }>((set) => (
    {
        exercises: [],
        setExercisesData: (data: ExerciseData[]) => set({ exercises: data })
    }
))
