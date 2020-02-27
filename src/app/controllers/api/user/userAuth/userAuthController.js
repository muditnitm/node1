import tokenervice from '../../../../services/tokenService'
import User from '../../../../models/user'
import { response_200, response_401, response_404, response_500, setResponse } from '../../../../lib/apiResponseFormat'
import { sendSms } from '../../../../services/contactService'
import Registrations from '../../../../models/registrations'
import { generateOTP } from '../../../../services/otpManager'


export async function login(req, res) {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                deletedAt: null,
                role: 'ADMIN'
            }
        })
        if (user && user.validatePassword(user.password, req.body.password)) {
            const token = tokenervice.generateToken({
                id: user.id,
                role: 'ADMIN'
            })
            res.cookie('auth', token, { maxAge: 9000000 })
            setResponse(res, response_200({ token }))
        } else {
            setResponse(res, response_401("Invalid credentials, Try again"))
        }

    } catch (error) {
        setResponse(res, response_500(`error while logging in user: ${error}`))
    }
}

export function checkUserExists(req, res, next) {
    return res.send('Authorization')
    next()
}

export async function sendOtpToPno(req, res) {
    try {
        const otp = generateOTP()
        const date = new Date()
        date.setTime(date.getTime() + (process.env.OTP_EXPIRE_MIN * 60 * 60 * 1000))
        const response = await sendSms(req.body.pno, otp)
        const success = response.data && response.data.ResponseCode > 0
        await Registrations.create({
            otp,
            pno: req.body.pno,
            expiry_date: date.getTime(),
            status: success ? 'SENT' : 'FAILED'
        })
        if (!success) {
            return setResponse(res, response_500("Unable to send OTP", response.data&& response.data.ResponseMessage))
        }
        return setResponse(res, response_200("OTP sent successfully"))
    } catch (error) {
        return setResponse(res, response_500("Unable to send OTP", error.message))
    }
}

export async function reSendOtpToPno(req, res) {
    try {
        const otp = generateOTP()
        const date = new Date()
        const createdAt = new Date()
        date.setTime(date.getTime() + (process.env.OTP_EXPIRE_MIN * 60 * 1000))
        createdAt.setTime(createdAt.getTime() - (10 * 60 * 1000))
        const response = await sendSms(req.body.pno, otp)
        const success = response.data.ResponseCode > 0
        await Registrations.update({
            otp,
            expiry_date: date.getTime(),
            status: success ? 'SENT' : 'FAILED'
        }, {
                where: {
                    pno: req.body.pno,
                    status: 'SENT',
                    verified: false,
                    createdAt: {
                        $gte: createdAt.getTime()
                    }
                }
            })
        if (!success) {
            return setResponse(res, response_500("Unable to re-send OTP", response.data.ResponseMessage))
        }
        return setResponse(res, response_200("OTP re-sent successfully"))
    } catch (error) {
        return setResponse(res, response_500("Unable to re-send OTP", error.message))
    }
}

export async function verifyOtp(req, res) {
    try {
        const response = await Registrations.findOne({
            where: {
                pno: req.body.pno,
                otp: req.body.otp,
                expiry_date: {
                    $gte: new Date().getTime()
                },
                status: 'SENT',
                verified: false
            }
        })
        if (response) {
            const user = await User.findOne({
                where: {
                    pno: req.body.pno,
                    role: req.body.role ? req.body.role : 'USER',
                    deletedAt: null
                }
            })
            await Registrations.update(
                { verified: true },
                {
                    where: {
                        pno: req.body.pno,
                        status: 'SENT'
                    }
                }
            )
            if (user) {
                const token = tokenervice.generateToken({
                    id: user.id,
                    role: req.body.role ? req.body.role : 'USER'
                })
                return setResponse(res, response_200({ verified: true, registered: true, token }))
            }
            return setResponse(res, response_200({ verified: true, registered: false, token: null, msg: 'new User, Please register' }))
        }
        return setResponse(res, response_200({ registered: false, verified: false, token: null, msg: 'OTP is Invalid/Expired' }))
    } catch (error) {
        return setResponse(res, response_200({ verified: false, registered: false, token: null, msg: 'Error while verifying OTP' }))
    }
}

export async function register(req, res) {
    try {
        const verified = await Registrations.findOne({
            where: {
                pno: req.body.pno,
                verified: true,
                status: 'SENT'
            }
        })
        console.log(`${JSON.stringify(verified)}------------------`)
        if (verified) {
            const user = await User.create({
                username: req.body.username,
                email: req.body.email,
                pno: req.body.pno,
                role: req.body.role ? req.body.role : 'USER',
                countryCode: req.body.countryCode,
                referralCode: '',
                password: req.body.password ? req.body.password : '',
                gender: req.body.gender,
                dob: new Date(req.body.dob).getTime()
            })
            const token = tokenervice.generateToken({
                id: user.id,
                role: req.body.role ? req.body.role : 'USER'
            })
            return setResponse(res, response_200({ msg: "User Registered successfully", token }))
        }
        return setResponse(res, response_200({ msg: "Phone number is not authenticated", token: null }))
    } catch (error) {
        console.log(error)
        setResponse(res, response_500({ msg: `Error while registering user: ${error.message}`, token: null }))
    }
}

export function logout(req, res) {
    res.send('logged out')
}