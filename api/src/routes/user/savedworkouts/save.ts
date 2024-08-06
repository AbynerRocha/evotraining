import { FastifyReply, FastifyRequest } from "fastify"
import { Workout, WorkoutSchema } from "../../../database/schemas/Workouts"
import WorkoutData from "../../../@types/Workout"
import { UserSavedWorkouts } from "../../../database/schemas/User"

const url = '/saved-workouts'
const method = 'POST'

type Request = {
    Body: {
        userId: string,
        workoutId: string
    }
}

function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    if (!req.body.userId || !req.body.workoutId) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { userId, workoutId } = req.body

    UserSavedWorkouts.create({
        userId,
        workout: workoutId 
    })
    .catch((err) => rep.status(500).send({ err: err.name, message: 'Não foi possivel realizar esta ação.' }))

    Workout.findByIdAndUpdate(workoutId)

    return rep.status(200).send()
}

export { url, method, handler }