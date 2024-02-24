import { FastifyReply, FastifyRequest } from "fastify"
import { UserTrainingPlan } from "../../../database/schemas/User"

const url = '/training-plan'
const method = 'POST'

type Request = {
    Body: {
        user: string,
        name: string
        plan: {
            restDay: boolean,
            weekDay: number,
            workout: string | null
        }[]
    }
}

function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })
    
    if(!req.body.name || !req.body.user || !req.body.plan) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })
    
    const { name, user, plan } = req.body

    UserTrainingPlan.create({
        name, 
        user, 
        createdAt: new Date(),
        plan
    })
    .then((data) => {
        data?.save()

        return rep.status(201).send()
    })
    .catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.' }))
}

export { url, method, handler }