import * as jwt from 'jsonwebtoken'
import env from '../../../config/env'

class TokenService {
    generateToken(payload) {
        // SIGNING OPTIONS
        const signOptions = {
            issuer: env.issuer,
            subject: env.subject,
            audience: env.audience,
            expiresIn: env.tokenExpiresIn,
            algorithm: env.tokenGenAlg
        };
        try {
            return jwt.sign(
                payload,
                env._private_key,
                signOptions
            )
        } catch (error) {
            console.log(error)
            throw new Error('Error while creating token')
        }
    }

    verifyToken(token) {
        const signOptions = {
            issuer: env.issuer,
            subject: env.subject,
            audience: env.audience,
            algorithm: [env.tokenGenAlg]
        };
        try {
            const payload = jwt.verify(token, env._public_key)
            return payload
        } catch (error) {
            return false
        }
    }

    decodeToken(token) {
        try {
            const payload = jwt.decode(token)
            // console.log(payload)
            return payload
        } catch (error) {
            throw new Error('Error while decoding token')
        }
    }
}

export default new TokenService()