import { FastifyRequest, FastifyReply } from "fastify";
import { validateLinkToken } from "../../../controllers/Tokens";
import { TokensBlackList } from "../../../database/schemas/Token";

const method = 'POST'
const url = '/link/r-pass'

type Request = {
    Body: {
        token: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { token } = req.body

    if(!token) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const result = await validateLinkToken(token)
    if(result === null) return rep.status(401).send({ error: 'TOKEN_EXPIRED', message: 'Não foi possivel realizar esta ação. (Token expirado)' })

    return rep.status(200).send()
}   

export { method, url, handler }