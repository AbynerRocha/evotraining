import { FastifyReply, FastifyRequest } from "fastify"
import { Workout } from "../../../database/schemas/Workouts"
import { User } from "../../../database/schemas/User"
import { Exercise } from "../../../database/schemas/Exercises"
import { ObjectId, Types } from "mongoose"
import { getUser } from "../../../controllers/Users"

const url = '/'
const method = 'GET'

type Request = {
    Querystring: {
        p: number,
        name?: string
        cb?: string
        id?: string,
        pvts: boolean // privates
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if(req.query.id) {
        const workout = await Workout.findById(req.query.id)

        if(workout === null) return rep.status(404).send({
            error: 'NOT_FOUND',
            message: 'Não foi possivel encontrar este treino.'
        })  

        const creator = await getUser({ _id: new Types.ObjectId(workout.createdBy) })
        const exercises = []

        for(const exerciseData of workout.exercises) {
            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, series: exerciseData.series })
        }

        let workoutData = {
            _id: workout._id.toString(),
            name: workout.name,
            createdAt: workout.createdAt,
            createdBy: creator,
            saves: workout.saves,
            lastEdit: workout.lastEdit,
            exercises,
            isPrivate: workout.isPrivate
        }

        return rep.status(200).send({ workout: workoutData })
    }

    let filters = {}

    if (req.query.name) {
        const regex = RegExp(`.*${req.query.name}*.`, 'i')
        filters = { ...filters, name: regex }
    }

    if (req.query.cb) {
        filters = { ...filters, createdBy: req.query.cb }
    }
    
    if (req.query.pvts) {
        filters = { ...filters, $or: [{ isPrivate: true }, { isPrivate: false }] }
    }

    const page = req.query.p

    const limit = 25
    const totalWorkouts = await Workout.countDocuments(filters)
    const numberOfPages = Math.ceil(totalWorkouts / limit)
    
    if(page > numberOfPages) return rep.status(400).send({
        error: 'PAGE_NOT_FOUND',
        message: `A página ${page} não existe.`,
        numberOfPages
    })
    
    const nextPage  = page ? page < numberOfPages ? Math.round(page)+1 : null : numberOfPages > 1 ? 2 : null
    const skipResults = page > 0 ? (page - 1) * limit : 0

    const workouts = await Workout.find(filters, {}, { skip: skipResults, limit })

    const data = []

    for (const workout of workouts) {
        const creator = await User.findById(workout.createdBy).select('-password')

        const exercises = []

        for(const exerciseData of workout.exercises) {
            const data = await Exercise.findById(exerciseData.exercise)
            exercises.push({ exercise: data, series: exerciseData.series })
        }

        let workoutData = {
            _id: workout._id,
            name: workout.name,
            createdAt: workout.createdAt,
            createdBy: creator,
            saves: workout.saves,
            lastEdit: workout.lastEdit,
            exercises,
            isPrivate: workout.isPrivate
        }

        data.push(workoutData)
    }

    return rep.status(200).send({ workouts: data, nextPage })
}

export { url, method, handler }
