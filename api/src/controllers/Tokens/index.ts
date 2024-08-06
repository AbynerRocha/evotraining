import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { TokensBlackList } from '../../database/schemas/Token'
import { env } from '../../env'

// Refresh Token

const refreshTokenDuration = '7d'
const secretRefreshToken = env.SECRET_JWT_REFRESH

export function generateRefreshToken(userId: Types.ObjectId) {
    const payload = {
        userId,
        type: 'refresh'
    }

    const token = jwt.sign(payload, secretRefreshToken, { expiresIn: refreshTokenDuration })
    return token
}

export async function validateRefreshToken(token: string) {
    const blToken = await TokensBlackList.findOne({ token })

    if (blToken !== null) return null

    try {
        const decoded = jwt.verify(token, secretRefreshToken) as { sub: string, userId: Types.ObjectId };
        return decoded;
    } catch (error) {
        return null; // Token inválido ou expirado
    }
}

// Auth Token 

const authTokenDuration = '1h'
const secretAuthToken = env.SECRET_JWT_AUTH

export function generateAuthToken(userId: Types.ObjectId, accessLevel: number) {
    const payload = {
        userId,
        accessLevel,
        type: 'auth'
    }

    const token = jwt.sign(payload, secretAuthToken, { expiresIn: authTokenDuration })
    return token
}

export async function validateAuthToken(token: string) {
    const blToken = await TokensBlackList.findOne({ token })

    if (blToken !== null) return null

    try {
        const decoded = jwt.verify(token, secretAuthToken) as { sub: string; userId: Types.ObjectId, accessLevel: number };
        return decoded;
    } catch (error) {
        return null; // Token inválido ou expirado
    }
}

// Tokens Links

const secretLinkToken = env.SECRET_JWT_LINK

export async function generateLinkToken(type: 'reset-pass' | 'verify-email' | 'request-rp', data: any) {
    const token = jwt.sign({ type, data }, secretLinkToken, { expiresIn: (type === 'reset-pass' ? '2h' : '12h') })
    return token
}

export async function validateLinkToken(token: string) {
    const blToken = await TokensBlackList.findOne({ token })

    if (blToken !== null) return null

    try {
        const decoded = jwt.verify(token, secretLinkToken) as { sub: string; type: 'reset-pass' | 'verify-email', data: any };
        return decoded;
    } catch (error) {
        return null; // Token inválido ou expirado
    }
}
