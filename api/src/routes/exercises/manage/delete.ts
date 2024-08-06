import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/'
const method = 'DELETE'

type Request = {
    Querystring: {
        id: string
    }
}

function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.query.id) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })

    const { id } = req.query

    Exercise.findByIdAndDelete(id)
    .then(() => {
        return rep.status(200).send()
    })
    .catch((err) => {
        return rep.status(500).send({
            error: err.name,
            message: 'Não foi possivel realizar esta ação neste momento.'
        })
    })
}

export { url, method, handler }