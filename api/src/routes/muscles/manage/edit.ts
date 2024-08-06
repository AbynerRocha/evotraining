import { FastifyReply, FastifyRequest } from "fastify"
import { Types } from "mongoose"
import { Exercise } from "../../../database/schemas/Exercises"
import { Muscle } from "../../../database/schemas/Muscles"

export const url = '/'
export const method = 'PUT'

type Request = {
    Querystring: {
        i: string, // id
        nn: string // new name
    }
}

export function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.i || !req.query.nn) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })

    const { i: id, nn: newName} = req.query

    Muscle.findByIdAndUpdate(id, { name: newName })
    .then((data) => {
        data?.save()

        return rep.status(200).send()
    })
    .catch((err) => {
        return rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.' })
    })
}