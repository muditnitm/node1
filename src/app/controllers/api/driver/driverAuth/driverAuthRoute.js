import * as app from 'express'

import {
    registerDriver
} from './driverAuthController'

class DriverAuthRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.post('/register', registerDriver)
        this.routes.post('/register', registerDriver)

    }
}

export default new DriverAuthRoutes().routes