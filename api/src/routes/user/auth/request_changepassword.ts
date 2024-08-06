import { FastifyRequest, FastifyReply } from "fastify"
import { User } from "../../../database/schemas/User"
import { generateLinkToken } from "../../../controllers/Tokens"
import EmailController from "../../../controllers/Email"
import { Request, RequestType } from "../../../database/schemas/Request"
import RequestController from "../../../controllers/Requests"
import { Resend } from "resend"
import { env } from '../../../env'

const method = 'POST'
const url = '/auth/request-changepassword'

const from = 'EvoTraining <no-reply@evotraining.pt>'

type Request = {
    Body: {
        email: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    if (!req.body.email) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    if (!req.headers['device-id']) return rep.status(400).send({
        error: 'MISSING_ID',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { email } = req.body

    const device = req.headers['device-id'] as string
    const requests = new RequestController()

    const requestsFromDevice = await requests.fromThisDevice(device)

    if (requestsFromDevice > 3) return rep.status(401).send({
        error: 'TOO_MANY_REQUESTS',
        message: 'Você execedeu o numero de pedidos, tente novamente em 20 minutos.'
    })

    const user = await User.findOne({ email }).catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação. Tente novamente mais tarde.' }))

    if (user === null) return rep.status(404).send({
        error: 'USER_NOT_FOUND',
        message: 'Não foi possivel encontrar este utilizador.'
    })

    const senderEmail = new EmailController()
    const token = await generateLinkToken('reset-pass', user._id)
    
    const resend = new Resend(env.RESEND_API_KEY)
    const html = senderEmail.getTemplate('reset-pass', { token })

    if(!html) return rep.status(500).send({ error: 'INTERNAL_ERROR', message: 'Não foi possivel realizar esta ação neste momemnto.' })

    resend.emails.send({
        to: email,
        from,
        subject: 'Troque a sua senha',
        html
    })
    
    requests.register(device, RequestType.CHANGE_PASSWORD)

    return rep.status(200).send()
}

export { method, url, handler }