import { HistoryData } from "../../@types/User"
import { Api } from "../../utils/Api"

class WorkoutService {
    static isSaved(userId: string, workoutId: string) {
        return new Promise<any>((resolve, reject) => {
            Api.get('/user/saved-workouts', { params: { uid: userId, wid: workoutId }})
            .then((res) => {
                if(res.data.savedWorkout) {
                    resolve(true)
                }
            })
            .catch((err) => reject(err))
        })
    }

    static save(userId: string, workoutId: string) {
        return new Promise((resolve, reject) => {
            Api.post(`/user/saved-workouts`, {
                userId,
                workoutId
            })
            .then((res) => {
                resolve(true)
            })
            .catch((err) => reject(err))
        })
    }

    static unSave(userId: string, workoutId: string) {
        return new Promise((resolve, reject) => {
            Api.delete(`/user/saved-workouts?uid=${userId}&wid=${workoutId}`)
            .then((res) => {
                resolve(true)
            })
            .catch((err) => reject(err))
        })
    }
}

class History {
    static getAll(userId: string) {
        return new Promise<HistoryData[]>((resolve, reject) => {
            Api.get('/user/workout-history', { params: { uid: userId }})
            .then((res) => {
                resolve(res.data.history)
            })
            .catch((err) => reject(err))
        })
    }

    static get(userId: string, page: number) {
        return new Promise<{ history: HistoryData[], nextPage: number | null }>((resolve, reject) => {
            Api.get('/user/workout-history', { params: { uid: userId, p: page, li: 10 }})
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => reject(err))
        })
    }

    static add(userId: string, workoutId: string) {
        return new Promise((resolve, reject) => {
            Api.post('/user/workout-history', {
                userId,
                workoutId
            })
            .then(() => resolve(true))
            .catch((err) => reject(err))
        })
    }
}

export default WorkoutService
export { History }
