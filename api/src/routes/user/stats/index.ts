import { FastifyReply, FastifyRequest } from "fastify"
import { UserExerciseStats } from "../../../database/schemas/User"

const url = '/stats'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string,
        eid?: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { uid: userId, eid: exerciseId } = req.query
    
    const stats = await UserExerciseStats.find({ userId }).select('-userId')

    if(exerciseId) {
        let exercises = []

        for(const stat of stats) {
            const data = stat.data.filter(st => st.exercise === exerciseId)

            exercises.push(data)
        }

        return rep.status(200).send({ stats: exercises })
    }

    return rep.status(200).send({ stats })   
}

export { method, url, handler }
