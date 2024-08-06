import { string } from "zod"
import { Muscle } from "../../database/schemas/Muscles"
import { getUser } from "../Users"
import { Types } from "mongoose"

export class MuscleController {
    static save({ name, createdBy }: { name: string, createdBy: string }) {
        return new Promise<boolean>((resolve, reject) => {
            Muscle.findOne({ name })
                .then((value) => {
                    if (value !== null) {
                        reject({
                            statusCode: 409,
                            error: 'ALREADY_EXISTS',
                            message: 'Este músculo já esta registado.'
                        })
                        return
                    }

                    Muscle.create({
                        name,
                        createdBy,
                        createdAt: new Date()
                    }).then(() => resolve(true))
                        .catch((err) => reject({
                            statusCode: 500,
                            error: err.name,
                            message: 'Não foi possivel salvar este músculo.',
                            cause: err
                        }))
                })
                .catch((err) => reject({
                    statusCode: 500,
                    error: err.name,
                    message: 'Não foi possivel salvar este músculo.',
                    cause: err
                }))
        })
    }

    static get(data: { _id: string, name: string, createdBy: string }) {
        return new Promise((resolve, reject) => {
            Muscle.findOne(data)
                .then(async (value) => {
                    if (value === null) {
                        reject({
                            error: 'NOT_FOUND',
                            message: 'Não foi possivel encontrar este músculo.'
                        })
                        return
                    }

                    const createdBy = await getUser({ _id: new Types.ObjectId(value.createdBy) })

                    resolve({
                        _id: value._id,
                        name: value.name,
                        createdBy,
                        createdAt: new Date()
                    })
                })
                .catch((err) => reject({
                    statusCode: 500,
                    error: err.name,
                    message: 'Não foi possivel encontrar este músculo.'
                }))
        })
    }
}
