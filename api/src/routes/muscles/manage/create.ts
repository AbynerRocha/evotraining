import { FastifyReply, FastifyRequest } from "fastify"
import { UserData } from "../../../@types/User"
import { Muscle } from "../../../database/schemas/Muscles"
import { MongooseError } from "mongoose"
import { MuscleController } from "../../../controllers/Muscle"

export const url = '/'
export const method = 'POST'

type Request = {
    Body: {
        name: string
        createdBy: string
    }
}

export async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento'
    })

    if(!req.body.name || !req.body.createdBy) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento'
    })

    const { name, createdBy } = req.body

    const result = await MuscleController.save({ name, createdBy })
    .catch((err) => {
        rep.status(err.statusCode).send({ error: err.error, message: err.message })
        console.error(err)
    })

    return rep.status(200).send({ result })
}