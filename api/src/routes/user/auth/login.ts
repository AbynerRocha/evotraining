import { FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { compareSync } from "bcrypt";
import { generateAuthToken, generateRefreshToken } from "../../../controllers/Tokens";
import { getUser, thisUserExists } from "../../../controllers/Users";
import { User } from "../../../database/schemas/User";

const method = 'POST'
const url = '/auth/login'

async function handler(req: FastifyRequest<{ Body: { email: string; password: string } }>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { email, password } = req.body

    if (!email || !password) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const exists = await thisUserExists(null, email)
    let userPassword = await User.findOne({ email }).select('password')

    if (!exists || userPassword === null) return rep.status(404).send({
        error: 'USER_NOT_FOUND',
        message: 'Utilizador inexistente'
    })

    if (!compareSync(password, userPassword.password)) return rep.status(401).send({
        error: 'WRONG_PASSWORD',
        message: 'Senha incorreta.'
    })

    const userData = await getUser({ email })

    const authToken = generateAuthToken(userData?._id, userData!.accessLevel)
    const refreshToken = generateRefreshToken(userData?._id)

    return rep.status(200).send({
        user: userData,
        refreshToken,
        authToken
    })
}

export { url, method, handler }