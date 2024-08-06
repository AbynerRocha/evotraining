import { FastifyReply, FastifyRequest, HTTPMethods } from "fastify"
import { User } from "../../../database/schemas/User"
import { updateUser } from "../../../controllers/Users"

const url = '/auth/verify-email'
const method: HTTPMethods = 'POST'

type Request = {
    Body: {
        code: string,
        userId: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { userId, code } = req.body

    const user = await User.findById(userId)

    if (!user) return rep.status(404).send({
        error: 'USER_NOT_FOUND',
        message: 'Utilizador inexistente'
    })

    if (code !== user.emailCode) return rep.status(400).send({
        error: 'INVALID_CODE',
        message: 'Este código não é válido.'
    })
    
    updateUser(user._id, { emailCode: '', verified: true })
        .catch((err: Error) => {
            return rep.status(500).send({ error: err.message, message: 'Não foi possivel realizar a verificação neste momento. Tente novamente mais tarde.' })
        })

    return rep.status(200).send()
}

export { method, url, handler }