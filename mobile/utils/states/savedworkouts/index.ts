import { create } from "zustand";
import { WorkoutData } from "../../../@types/Workout";

type Store = { 
    workout?: WorkoutData | WorkoutData[]
    setWorkouts: (data: WorkoutData[]) => void 
}

export const useSavedWorkoutsStore = create<Store>((set) => (
    {
        workout: undefined,
        setWorkouts: (data) => set({ workout: data })
    }
))