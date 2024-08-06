import { FastifyReply, FastifyRequest } from "fastify"
import { UserExerciseStats, UserSavedWorkouts } from "../../../database/schemas/User"

const url = '/stats'
const method = 'POST'

type Request = {
    Body: {
        userId: string,
        exerciseId: string,
        stats: {
            weight: number,
            reps: number,
            date: Date
        }[]
    }
}

function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    if (!req.body.userId || !req.body.exerciseId || !req.body.stats) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { exerciseId, userId, stats } = req.body

    UserExerciseStats.findOne({ userId })
    .then((value) => {
        if(value === null) {
            UserExerciseStats.create({
                userId,
                data: [{
                    stats,
                    exercise: exerciseId
                }]
            })
            return rep.status(201).send()
        }

        const data = value?.data

        data.push({ exercise: exerciseId, stats })

        UserExerciseStats.updateOne({ _id: value?._id }, { data }).catch((err) => { throw err })

        return rep.status(200).send()
    })
    .catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação.' }))
}

export { url, method, handler }
