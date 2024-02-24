import { FastifyReply, FastifyRequest } from "fastify"
import { UserWorkoutsHistory } from "../../../database/schemas/User";
import { Workout } from "../../../database/schemas/Workouts";
import WorkoutController from "../../../controllers/Workout";
import WorkoutData from "../../../@types/Workout";

const url = '/frequency'
const method = 'GET'

type Request = {
    Querystring: {
        uid: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.query.uid) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação'
    })

    const data = await UserWorkoutsHistory.find({ user: req.query.uid })

    let ordenedData = []

    for (const history of data) {
        if(!history.workout) continue

        const workout = await WorkoutController.getById(history.workout)

        if(workout === null) continue

        ordenedData.push({
            date: history.date,
            workout
        })
    }

    const length = ordenedData.length;

    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - i - 1; j++) {
            if (ordenedData[j].date > ordenedData[j + 1].date) {
                const temp: any = ordenedData[j];

                ordenedData[j] = ordenedData[j + 1];
                ordenedData[j + 1] = temp;
            }
        }
    }

    return rep.status(200).send({ data: ordenedData })
}

export { url, method, handler }
