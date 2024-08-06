import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FastifyRequest, FastifyReply } from "fastify";
import { r2 } from "../../../utils/cloudflare/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env";
import { User } from "../../../database/schemas/User";
import { v4 as uuid } from 'uuid'
import { fastifyMultipart } from "@fastify/multipart";

const url = '/user-avatar'
const method = 'POST'


type Request = {
    Querystring: {
        fname: string,
        uid: string,
    },
    Headers: {
        'Content-Type': string
    }
}



async function verifyParams(req: FastifyRequest<Request>, rep: FastifyReply) {
    const file = await req.file()

    if(!file) { 
        rep.status(400).send({
            error: 'MISSING_DATA (filename)',
            message: 'Não foi possivel realizar esta ação neste momento.'
        })
        return null 
    }
    
    if(!req.query.uid) { 
        rep.status(400).send({
            error: 'MISSING_DATA (userid)',
            message: 'Não foi possivel realizar esta ação neste momento.'
        })
        return null
    }

    return { 
        file,
        userId: req.query.uid
    }
}

async function handler(req: FastifyRequest<Request>, rep: FastifyReply) {
    console.log(await req.file())
    const params = await verifyParams(req, rep)

    if(params === null) return 

    const { file, userId } = params

    const signedUrl = await getSignedUrl(r2, new PutObjectCommand({
        Key: userId+'-avatar',
        Bucket: env.CLOUDFLARE_BUCKET,
        ContentType: file.type,
    }))

    fetch(signedUrl, {
        method: 'PUT',
        body: await file.toBuffer(),
    }).then(() => rep.status(200).send())
    .catch((err) => rep.status(err.code).send({ error: err.name, message: 'Não foi possivel realizar esta ação' }))

    return rep.status(200).send()
}
// const params = verifyParams(req, rep)

// if(params === null) return 

// const fileExt = params.fileName.split('.').pop()

// console.log(params.contentType)

// const signedUrl = await getSignedUrl(
//     r2,
//     new PutObjectCommand({
//         Bucket: env.CLOUDFLARE_BUCKET,
//         Key: `avatar-${params.userId}`,
//         ContentType: 'image/'+fileExt
//     }),
//     { expiresIn: 500 }
// )

// User.findByIdAndUpdate(params.userId, { avatar:  })

// return rep.status(200).send(signedUrl)

export { url, method, handler }