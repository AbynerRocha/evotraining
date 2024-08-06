import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/asdasdas'
const method = 'GET'

async function handler(req: FastifyRequest, rep: FastifyReply) {
    const data = await Exercise.find({
        muscles: {
            $in: ['65caab2d885a7cdcc4c0cba3', '65caa8aa885a7cdcc4c0c7cas']
        }
    })

    return rep.status(200).send({ data })
}

export { url,method,handler }
