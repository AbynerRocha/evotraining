import { FastifyReply, FastifyRequest } from "fastify"
import EmailController from "../../../controllers/Email"
import { thisUserExists, addUser } from "../../../controllers/Users"
import { getRandomInt } from "../../../utils/randomMinMax"
import { generateLinkToken } from "../../../controllers/Tokens"

const method = 'POST'
const url = '/auth/register'

type Request = {
  Body: {
    name: string
    email: string
    password: string
  }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
  if (!req.body) return rep.status(400).send({
    error: 'MISSING_DATA',
    message: 'Não foi possivel realizar esta ação.'
  })

  const { name, email, password } = req.body

  if (!name || !email || !password) return rep.status(400).send({
    error: 'MISSING_DATA',
    message: 'Não foi possivel realizar esta ação.'
  })

  const exists = await thisUserExists(null, email)

  if (exists) return rep.status(400).send({
    error: 'THIS_USER_ALREADY_EXISTS',
    message: 'Este email já está a ser utilizado.'
  })

  const emailVerifyCode = getRandomInt(11111, 99999).toString()

  addUser({
    name,
    email,
    password,
    accessLevel: 1,
    createdAt: new Date(),
    verified: false,
    emailCode: emailVerifyCode

  })
    .then(async (data) => {
      const token = await generateLinkToken('verify-email', data._id)
      const email = new EmailController()

      email.send({
        to: data.email,
        subject: 'Verifique o seu email',
        template: 'verify-email',
        data: {
          token,
          emailCode: emailVerifyCode
        }
      }).catch((err) => {
        return rep.status(500).send({ error: err.code, message: 'Não foi possivel realizar o registo neste momento. Tente novamente mais tarde' })
      })
    })
    .catch((err) => {
      return rep.status(500).send({ error: err.code, message: 'Não foi possivel realizar o registo neste momento. Tente novamente mais tarde' })
    })



  return rep.status(201).send()
}

export { handler, method, url }