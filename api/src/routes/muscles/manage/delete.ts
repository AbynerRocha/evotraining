import { FastifyReply, FastifyRequest } from "fastify"
import { Muscle } from "../../../database/schemas/Muscles"

export const url = '/'
export const method = 'DELETE'

type Request = {
    Querystring: {
        id: string
    }
}

export function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.id) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })

    const { id } = req.query

    Muscle.findByIdAndDelete(id)
    .then(() => {
        return rep.status(200).send()
    })
    .catch((err) => {
        return rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.' })
    })
}