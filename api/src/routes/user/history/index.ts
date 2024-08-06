import { FastifyReply, FastifyRequest } from "fastify"
import { UserWorkoutsHistory } from "../../../database/schemas/User"
import { Workout } from "../../../database/schemas/Workouts"
import WorkoutData from "../../../@types/Workout"

const url = '/workout-history'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string // userId
        p?: number // page
        li?: number // limit
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { uid: userId } = req.query

    const page = req.query.p
    const limit = req.query.li || 15
    const total = await UserWorkoutsHistory.countDocuments({ user: userId })
    const numberOfPages = Math.ceil(total / limit)

    if (page && page > numberOfPages) return rep.status(400).send({
        error: 'PAGE_NOT_FOUND',
        message: `A página ${page} não existe.`,
        numberOfPages
    })

    const nextPage  = page ? page < numberOfPages ? Math.round(page)+1 : null : numberOfPages > 1 ? 2 : null
    const skipResults = page && page > 0 ? (page - 1) * limit : 0

    const historyData = await UserWorkoutsHistory.find({ user: userId }, {}, { skip: skipResults, limit }).catch((err) => {
        return rep.status(500).send({
            error: err.name,
            message: 'Não foi possivel realizar esta ação.'
        })
    })

    let history: any[] = []
    

    for (const value of historyData) {
        const workout = await Workout.findById(value.workout)

        history.push({
            date: new Date(value.date),
            workout
        })
    }

    return rep.status(200).send({ history, nextPage, numberOfPages })
}

export { url, method, handler }