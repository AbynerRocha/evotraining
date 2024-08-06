import { FastifyReply, FastifyRequest } from "fastify"
import { ExerciseData } from "../../../@types/Exercise/Index"
import { Workout } from "../../../database/schemas/Workouts"

const url = '/'
const method = 'PUT'

type Request = {
    Body: {
        id: string,
        name: string,
        exercises: { 
            exercise: string, 
            series: { 
                reps: number, 
                restTime: number 
            }[] 
        }[]
    }
}

function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })
    
    if(!req.body.id || !req.body.name || !req.body.exercises) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação neste momento.'
    })

    const { id, name, exercises } = req.body

    Workout.findByIdAndUpdate(id, {
        name,
        exercises,
        lastEdit: new Date()
    }).then((data) => {
        data?.save()

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
