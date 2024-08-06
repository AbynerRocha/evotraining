import { FastifyReply, FastifyRequest } from "fastify"
import { UserWorkoutsHistory } from "../../../database/schemas/User"

const url = '/workout-history'
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
    
    UserWorkoutsHistory.create({
        user: userId,
        workout: workoutId,
        date: new Date()
    }).then((data) => {
        data?.save()
        
        return rep.status(201).send()
    })
    .catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação.' }))
}

export { url, method, handler }
