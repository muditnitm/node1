import Cache from '../../../../services/redisCacheBuilder'
import tokenervice from '../../../../services/tokenService'
import User from '../../../../models/user'
import Rides from '../../../../models/rides'
import Documents from '../../../../models/documents'
import Vehicle from '../../../../models/vehicle'
import EmergencyContact from '../../../../models/emergencyContact'
import Address from '../../../../models/address'
import walletTransaction from '../../../../models/walletTransaction'
import { response_200, response_401, response_404, response_500, setResponse } from '../../../../lib/apiResponseFormat'

export async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            where: {
                role: req.query.role ? req.query.role : 'USER',
            },
            paranoid: false,
            attributes: { exclude: ['password', 'role'] }
        })

        setResponse(res, response_200(users))
    } catch (error) {
        setResponse(res, response_500(`error while logging in user: ${error}`))
    }
}

export async function getUserProfile(req, res) {
    try {
        const userProfile = await User.findOne({
            where: {
                id: req.query.id,
                role: req.query.role ? req.query.role : 'USER'
            },
            paranoid: false,
            include: [
                {
                    model: Rides,
                    as: 'rides'
                }, {
                    model: Address,
                    as: "address"
                }, {
                    model: EmergencyContact
                }, {
                    model: walletTransaction,
                    as: 'transactions'
                }, {
                    model: Vehicle,
                    as: 'vehicle'
                }, {
                    model: Documents,
                    as: 'documents'
                }],
            attributes: { exclude: ['password', 'role'] }
        })
        setResponse(res, response_200({ userProfile }))
    } catch (error) {
        setResponse(res, response_500(`error while getting user profile: ${error.message}`))
    }
}

export async function login(req, res) {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.username,
                deletedAt: null,
                role: 'ADMIN'
            }
        })
        if (user && user.validatePassword(user.password, req.body.password)) {
            const token = tokenervice.generateToken({
                id: user.id,
                role: req.body.role ? req.body.role : 'USER'
            })
            res.cookie('auth', token, { maxAge: 1000 * 60 * 60, httpOnly: true })
            setResponse(res, response_200({ token, user: { name: user.username, email: user.email, dob: user.dob, pno: user.pno } }))
        } else {
            setResponse(res, response_401("Invalid credentials, Try again"))
        }

    } catch (error) {
        setResponse(res, response_500(`error while logging in user: ${error}`))
    }
}

export async function verifyToken(req, res) {
    try {
        const payload = tokenervice.verifyToken(req.body.token)
        if (payload && payload.role === 'ADMIN') {
            return setResponse(res, response_200(true))
        }
        setResponse(res, response_200(false))
    } catch (error) {
        setResponse(res, response_500(false))
    }
}