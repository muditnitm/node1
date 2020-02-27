import * as app from 'express'

import { login, register, sendOtpToPno, verifyOtp, reSendOtpToPno } from './userAuthController'

class UserAuthRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.post('/login', login)
        this.routes.post('/register', register)
        this.routes.post('/generateOtp', sendOtpToPno)
        this.routes.post('/reSendOtp', reSendOtpToPno)
        this.routes.post('/verifyOtp', verifyOtp)
        this.routes.get('/test', (req, res) => { res.send("Testing API") })
    }
}

export default new UserAuthRoutes().routes