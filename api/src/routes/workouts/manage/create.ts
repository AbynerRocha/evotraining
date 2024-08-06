import { FastifyReply, FastifyRequest } from "fastify"
import { ExerciseData } from "../../../@types/Exercise/Index"
import { Workout } from "../../../database/schemas/Workouts"

const url = '/'
const method = 'POST'

type Request = {
    Body: {
        name: string,
        createdBy: string
        exercises: { exercise: string, series: { reps: number, restTime: number }[] }[],
        isPrivate: boolean
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA (body)',
        message: 'Não foi possivel realizar esta ação.'
    })

    if(!req.body.name || !req.body.createdBy || !req.body.exercises || req.body.isPrivate === undefined) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { name, createdBy, exercises, isPrivate } = req.body

    const thisWorkoutExists = await Workout.find({ name })

    if(thisWorkoutExists.length > 0) return rep.status(400).send({
        error: 'ALREADY_EXISTS',
        message: `'${name}' já foi registado.`,
        thisWorkoutExists
    })

    const workout = await Workout.create({ name, createdBy, createdAt: new Date(), exercises, saves: 0, isPrivate })
    .catch((err) => {
        console.log(err);
        return rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação neste momento.'})
    })

    return rep.status(201).send({ workout })
}

export { url, method, handler }
