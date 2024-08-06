import { FastifyReply, FastifyRequest } from "fastify"
import { UserSavedWorkouts } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"

const url = '/saved-workouts'
const method = 'DELETE'

type Request = {
    Querystring: {
        uid: string,
        wid: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.uid || !req.query.wid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { uid: userId, wid: workoutId } = req.query

    const workout = await Workout.findById(workoutId)

    UserSavedWorkouts.findOneAndDelete({ userId, workout: workoutId })
    .catch((err) => rep.status(500).send({ err: err.name, message: 'Não foi possivel realizar esta ação.' }))


    return rep.status(200).send()
}

export { url, method, handler }