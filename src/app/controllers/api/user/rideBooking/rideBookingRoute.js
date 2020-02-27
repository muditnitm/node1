import * as app from 'express'

import {
    bookRide
} from './rideBookingController'

class UserRideRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.post('/bookRide', bookRide)

    }
}

export default new UserRideRoutes().routes