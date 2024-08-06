import { Types } from "mongoose";
import { UserData } from "../../@types/User";
import { User } from "../../database/schemas/User";
import bcrypt, { hashSync } from 'bcrypt'

export async function thisUserExists(id: string | null, email?: string) {
    if (id) {
        const exists = await User.exists({ _id: id })

        return !!exists
    } else if (email) {
        const exists = await User.exists({ email })

        return !!exists
    }

    return false
}

export function addUser(user: Omit<UserData, '_id'>) {
    return new Promise<Omit<UserData, 'password'>>(async (resolve, reject) => {
        const exists = await thisUserExists(null, user.email)

        if (exists) {
            reject({
                error: 'USER_IS_ALREADY_REGISTERED',
                status: 400,
                message: 'Este email já está a ser utilizado.'
            })
            return
        }

        const { password, ...userWithouPass } = user

        const hashPass = bcrypt.hashSync(password, 10)

        const userRegistered = new User({ password: hashPass, ...userWithouPass })

        userRegistered.save().then(() => {
            const dataToReturn = {
                _id: userRegistered._id,
                name: userRegistered.name,
                email: userRegistered.email,
                avatar: userRegistered?.avatar,
                createdAt: userRegistered.createdAt,
                accessLevel: userRegistered.accessLevel
            }

            resolve(dataToReturn)
        })
    })
}

export function deleteUser(id: string) {
    return new Promise<boolean>(async (resolve, reject) => {
        const exists = await thisUserExists(id)

        if (!exists) {
            reject({
                error: 'USER_NOT_FOUND',
                status: 404,
                message: 'Não foi possivel realizar esta ação.'
            })
            return
        }

        User.deleteOne({ _id: id })
            .then(() => resolve(true))
            .catch((err) => reject({
                error: err.message,
                status: 500,
                message: 'Não foi possivel realizar esta ação.'
            }))
    })
}

type UserOptionalData = {
    [K in keyof UserData]?: UserData[K]
}

export async function updateUser(id: Types.ObjectId, updateData: UserOptionalData) {

    return new Promise((resolve, reject) => {
        let hashPassword = ''   

        if(updateData._id) {
            reject('You cant edit the userid')
            return 
        }

        User.findOneAndUpdate({ _id: id }, { ...updateData })
        .then(() => {
            resolve(true)
        })
        .catch((err) => reject(err))

    })
}

export async function getUser(data: UserOptionalData) {
    return new Promise<Omit<UserData, 'password'>>((resolve,reject) => {
        User.findOne({
            ...data
        })
        .then((value) => {
            if(value === null) {
                reject({
                    error: 'USER_NOT_FOUND',
                    message: 'Não foi possivel encontrar o utilizador'
                })
                return
            }

            resolve({
                _id: value._id,
                name: value.name,
                email: value.email,
                emailCode: value.emailCode,
                verified: value.verified,
                avatar: value.avatar,
                accessLevel: value.accessLevel,
                createdAt: value.createdAt
            })
        })
        .catch(reject)
    })
}
