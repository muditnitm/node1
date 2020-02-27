import * as app from 'express'

import { getUsers, login, verifyToken, getUserProfile } from './userManagementController'
import {adminAuthentication} from '../../../../services/authService'

class UserAuthRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.get('/getUsers', adminAuthentication, getUsers)
        this.routes.get('/getUserProfile', adminAuthentication, getUserProfile)
        this.routes.post('/login',  login)
        this.routes.post('/verifyToken',  verifyToken)
        // this.routes.get('/test', (req, res)=>{res.send("Testing API")})
    }
}

export default new UserAuthRoutes().routes