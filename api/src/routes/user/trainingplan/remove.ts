import { FastifyReply, FastifyRequest } from "fastify"
import { UserTrainingPlan } from "../../../database/schemas/User"

const url = '/training-plan'
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

    UserTrainingPlan.findByIdAndDelete(req.query.id)
    .then(() => rep.status(200).send())
    .catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.' }))
}

export { url, method, handler }