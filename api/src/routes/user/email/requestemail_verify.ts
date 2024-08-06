import { FastifyRequest, FastifyReply } from "fastify"
import RequestController from "../../../controllers/Requests"
import EmailController from "../../../controllers/Email"
import { User } from "../../../database/schemas/User"
import { getRandomInt } from "../../../utils/randomMinMax"
import { generateLinkToken } from "../../../controllers/Tokens"

const url = '/email/r/verify-email'
const method = 'POST'

type Request = {
    Body: {
        userId: string
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    if (!req.body) return rep.status(400).send({
        error: 'MISSING_DATA',
        message: 'Não foi possivel realizar esta ação.'
    })

    if (!req.headers['device-id']) return rep.status(400).send({
        error: 'MISSING_ID',
        message: 'Não foi possivel realizar esta ação.'
    })

    const { userId } = req.body

    const device = req.headers['device-id'].toString()
    const requests = new RequestController()

    const requestsFromDevice = await requests.fromThisDevice(device)

    if (requestsFromDevice > 3) return rep.status(401).send({
        error: 'TOO_MANY_REQUESTS',
        message: 'Você execedeu o numero de pedidos, tente novamente em 20 minutos.'
    })

    const email = new EmailController()
    const emailVerifyCode = getRandomInt(11111, 99999).toString()

    User.findByIdAndUpdate({ _id: userId }, { emailCode: emailVerifyCode })
    .then((data) => {
        data?.save().then(async (user) => {
            const token = await generateLinkToken('verify-email', data._id)
    
            email.send({
                to: user.email,
                subject: 'Verique o seu Email',
                template: 'verify-email',
                data: {
                    token,
                    emailCode: emailVerifyCode
                }
            }).then(() => {
                return rep.status(200).send({ newCode: emailVerifyCode })
            }).catch((err) => err)
        }).catch((err) => err)
    })
    .catch((err) => rep.status(500).send({ error: err.name, message: 'Não foi possivel realizar esta ação. Tente novamente mais tarde.' }))
}

export { url, method, handler }