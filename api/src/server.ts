import fastify from 'fastify'
import routes from './routes/routes'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import './database'
import { env } from './env'

const server = fastify()
const port = env.HTTP_PORT

server.register(cors, {
    origin: '*',
    allowedHeaders: ['*'],
    methods: ['POST', 'GET', 'DELETE', 'PUT']
})

server.register(multipart)

server.get('/', async (req, rep) => {
    return rep.status(200).send({ ok: true })
})

routes.map((route) => server.register(route.plugin, { prefix: route.prefix }))

server.listen({ port }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('[√] Server online');
})
