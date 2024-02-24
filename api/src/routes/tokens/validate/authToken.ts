import { FastifyRequest, FastifyReply } from "fastify"
import { generateAuthToken, validateRefreshToken } from "../../../controllers/Tokens"
import { AccessLevel } from "../../../@types/User"
import { User } from "../../../database/schemas/User"

const url = '/revalidate-auth-token'
const method = 'POST'

type Request = {
    Querystring: {
        p: number
    },
    Headers: {
        'refresh-token': string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply){
    if(!req.headers["refresh-token"]) return rep.status(403).send({ error: 'MISSING_AUTH' })

    const refreshToken = req.headers["refresh-token"]

    const isRefreshTokenValid = await validateRefreshToken(refreshToken)

    if(isRefreshTokenValid === null) return rep.status(403).send({
        logout: true,
        error: 'REFRESH_TOKEN_EXPIRED',
        message: 'A sua sessão expirou!'
    })

    const userRequesting = await User.findById(isRefreshTokenValid.userId).select('accessLevel')
    const accessLevel = userRequesting?.accessLevel as AccessLevel
    
    const newAuthToken = generateAuthToken(isRefreshTokenValid.userId, accessLevel)
    
    return rep.status(200).send({
        authToken: newAuthToken
    })
}

export { url, method, handler }