import { FastifyReply, FastifyRequest } from "fastify"
import { TokensBlackList } from "../../../database/schemas/Token"

const method = 'POST'
const url = '/auth/signout'

type Request = {
    Querystring: {
        at: string,
        rf: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    const { at, rf } = req.query

    try {
        TokensBlackList.create({ token: rf })
        TokensBlackList.create({ token: at })
    } catch (error) {
        return rep.status(500).send({ error, mesage: 'Não foi possivel realizar esta ação neste momento. Tente novamente mais tarde.' })
    }

    return rep.status(200).send()
}

export { method, url, handler }