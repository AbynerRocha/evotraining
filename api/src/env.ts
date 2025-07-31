import { z } from 'zod'

import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    HTTP_PORT: z.string().transform((v) => parseInt(v)) || z.number(),
    SECRET_JWT_REFRESH: z.string(),
    SECRET_JWT_AUTH: z.string(),
    SECRET_JWT_LINK: z.string(),

    CONNECT_URL_MONGODB: z.string(),

    RESEND_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
