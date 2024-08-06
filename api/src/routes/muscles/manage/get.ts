import { FastifyReply, FastifyRequest } from "fastify"
import { Muscle } from "../../../database/schemas/Muscles"
import { Exercise } from "../../../database/schemas/Exercises"
import { getUser } from "../../../controllers/Users"
import { Types } from "mongoose"

export const url = '/'
export const method = 'GET'

type Request = {
    Querystring: {
        id?: string
        name?: string
        p?: number
    }
}


export async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (req.query.id) {
        const muscle = await Muscle.findById(req.query.id)

        if (muscle === null) {
            return rep.status(404).send({ error: 'NOT_FOUND', message: 'Não foi possivel encontrar um músculo com este nome.' })
        }

        const numberOfExercise = await Exercise.count({ muscles: muscle._id })
        const createdBy = await getUser({ _id: new Types.ObjectId(muscle.createdBy) })

        return rep.status(200).send({
            muscle: {
                _id: muscle._id,
                name: muscle.name,
                createdAt: muscle.createdAt,
                createdBy,
                numberOfExercise
            }
        })
    }

    if (req.query.name) {
        const regexName = RegExp(`.*${req.query.name}.*`, 'i')

        const muscle: any = await Muscle.find({ name: regexName }, {}, { skip: (req.query.p ? req.query.p > 1 ? 10 * req.query.p : 0 : 0), limit: 25 })

        if (muscle === null) {
            return rep.status(404).send({ error: 'NOT_FOUND', message: 'Não foi possivel encontrar um músculo com este nome.' })
        }

        const numberOfExercise = await Exercise.count({ muscle: muscle._id })
        const createdBy = await getUser({ _id: new Types.ObjectId(muscle.createdBy) })

        return rep.status(200).send({
            muscle: {
                _id: muscle._id,
                name: muscle.name,
                createdAt: muscle.createdAt,
                createdBy,
                numberOfExercise
            }
        })
    }

    const { p: page } = req.query

    const muscles = await Muscle.find({}, {}, { skip: (page ? page > 1 ? 10 * page : 0 : 0), limit: 25 })

    let data: any[] = []

    for (const muscle of muscles) {

        const numberOfExercises = await Exercise.count({ muscle: muscle._id })
        const createdBy = await getUser({ _id: new Types.ObjectId(muscle.createdBy) })

        data.push({
            _id: muscle._id,
            name: muscle.name,
            createdAt: muscle.createdAt,
            createdBy,
            numberOfExercises
        })
    }

    return rep.status(200).send({ muscles: data })
}