import { FastifyReply, FastifyRequest } from "fastify"
import { Exercise } from "../../../database/schemas/Exercises"
import { generateAuthToken, validateAuthToken, validateRefreshToken } from "../../../controllers/Tokens"
import { User } from "../../../database/schemas/User"
import { AccessLevel } from "../../../@types/User"
import { Muscle } from "../../../database/schemas/Muscles"
import { getUser } from "../../../controllers/Users"
import { ObjectId, Types } from "mongoose"

const url = '/'
const method = 'GET'

type Request = {
    Querystring: {
        id?: string
        name?: string
        muscle?: string
        creatorName?: string[]
        muscleName?: string[]
        p: number
        li?: number
    },
    Headers: {
        'auth-token': string
        'refresh-token': string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (req.query.id) {
        const exercise = await Exercise.findById(req.query.id)

        if(exercise === null) return rep.status(404).send({ 
            error: 'NOT_FOUND',
            message: 'Não foi possivel encontrar este exercício.'
        })

        let muscles = []

        for(const muscle of exercise.muscles) {
            const muscleData = await Muscle.findById(muscle)

            muscles.push(muscleData)
        }

        const creator = await getUser({ _id: new Types.ObjectId(exercise.createdBy) })

        let exerciseData = {
            _id: exercise._id,
            name: exercise.name,
            difficulty: exercise.difficulty,
            image: exercise.image,
            createdAt: exercise.createdAt,
            muscle: muscles,
            createdBy: creator
        }

        return rep.status(200).send({ exercise: exerciseData })
    }
    
    let filters = {}

    if (req.query.name) {
        filters = { ...filters, name: RegExp(`.*${req.query.name}.*`, 'i') }
    }

    if(req.query.creatorName) {
        let creatorsId = []
        
        for(const creator of req.query.creatorName) {
            const userData = await User.find({ name: RegExp(`.*${creator}.*`, 'i'), accessLevel: 2 })
            
            if(userData === null) return rep.status(404).send({
                error: 'CREATOR_NOT_FOUND',
                message: 'Não foi possivel encontrar este utilizador: ' + creator
            })

            for(const { _id } of userData) {

                creatorsId.push(_id)
            }
        }

        filters = {...filters, $or: creatorsId.map((v) => v && { createdBy: v }) }
    }

    if(req.query.muscleName) {
        let musclesId = []
        
        for(const muscle of req.query.muscleName) {
            const muscleData = await Muscle.find({ name: RegExp(`.*${muscle}.*`, 'i') })
            
            if(muscleData === null) return rep.status(404).send({
                error: 'MUSCLE_NOT_FOUND',
                message: 'Não foi possivel encontrar este músculo: ' + muscle
            })

            for(const { _id } of muscleData) {
                musclesId.push(_id)
            }
        }

        filters = {...filters, muscles: { $in: musclesId.map((v) => v && { muscle: v }) } }
    } else if (req.query.muscle) {
        filters = { ...filters, muscles: req.query.muscle }
    }

    const page = req.query.p 
    const limit = req.query.li || 10
    const totalExercises = await Exercise.countDocuments(filters)
    const numberOfPages = Math.ceil(totalExercises / limit)
    
    if(page > numberOfPages) return rep.status(400).send({
        error: 'PAGE_NOT_FOUND',
        message: `A página ${page} não existe.`,
        numberOfPages
    })
    
    const nextPage = page ? page < numberOfPages ? Math.round(page)+1 : null : numberOfPages > 1 ? 2 : null
    const skipResults = (page - 1) * limit

    const exercises = await Exercise.find(filters, {}, { skip: skipResults, limit })
    const data = []

    for (const exercise of exercises) {
        let muscles = []

        for(const muscle of exercise.muscles) {
            const muscleData = await Muscle.findById(muscle)

            muscles.push(muscleData)
        }

        const creator = await getUser({ _id: new Types.ObjectId(exercise.createdBy) })
        

        let exerciseData = {
            _id: exercise._id,
            name: exercise.name,
            difficulty: exercise.difficulty,
            image: exercise.image,
            createdAt: exercise.createdAt,
            muscles: muscles,
            createdBy: creator
        }

        data.push(exerciseData)
    }

    return rep.status(200).send({ exercises: data, numberOfPages, nextPage })
}

export { url, method, handler }