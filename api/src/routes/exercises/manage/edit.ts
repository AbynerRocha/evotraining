import { FastifyReply, FastifyRequest } from "fastify"
import { Types } from "mongoose"
import { Exercise } from "../../../database/schemas/Exercises"

const url = '/edit'
const method = 'POST'

type Request = {
    Body: {
        id: string,
        newData: any
    }
}

function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })

    if(!req.body.newData|| !req.body.id) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })

    const { newData, id } = req.body
    
    Exercise.findByIdAndUpdate(id, newData)
    .then((data) => {
        data?.save()

        return rep.status(200).send()
    })
    .catch((err) => {
        console.error(err)

        return rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.' })
    })
}

export { url, method, handler }
