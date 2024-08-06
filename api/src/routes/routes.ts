import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { join } from "path";
import fs from 'fs'

export async function loadRoutes(name: string, app: FastifyInstance, _opts: FastifyPluginOptions, done: any) {
    const path = join(__dirname, name)
    const routes = fs.readdirSync(path)

    for (const paths of routes) {
        const routePath = join(path, paths)
        const routeFiles = fs.readdirSync(routePath)

        for (const file of routeFiles) {
            const filePath = join(routePath, file)
            const route = require(filePath)

            app.route(route)
            done()
        }
    }
}

const routes = [
    {
        plugin: (app: FastifyInstance, _opts: FastifyPluginOptions, done: any) => loadRoutes('user', app, _opts, done),
        prefix: '/user'
    },
    {
        plugin: (app: FastifyInstance, _opts: FastifyPluginOptions, done: any) => loadRoutes('tokens', app, _opts, done),
        prefix: '/token'
    },
    {
        plugin: (app: FastifyInstance, _opts: FastifyPluginOptions, done: any) => loadRoutes('exercises', app, _opts, done),
        prefix: '/exercise'
    },
    {
        plugin: (app: FastifyInstance, _opts: FastifyPluginOptions, done: any) => loadRoutes('muscles', app, _opts, done),
        prefix: '/muscle'
    },
    {
        plugin: (app: FastifyInstance, _opts: FastifyPluginOptions, done: any) => loadRoutes('workouts', app, _opts, done),
        prefix: '/workout'
    },
    {
        plugin: (app: FastifyInstance, _opts: FastifyPluginOptions, done: any) => loadRoutes('upload', app, _opts, done),
        prefix: '/upload'
    },
]

export default routes