import * as app from 'express'

import {
    createEmergencyContact,
    updateEmergencyContact,
    getEmergencyContact,
    createAddress,
    updateAddress,
    getAddress,
    deleteAddress,
} from './userAddressController'

class UserAddressRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.post('/emergencyContact', createEmergencyContact)
        this.routes.put('/emergencyContact', updateEmergencyContact)
        this.routes.get('/emergencyContact', getEmergencyContact)
        this.routes.post('/address', createAddress)
        this.routes.put('/address', updateAddress)
        this.routes.delete('/address', deleteAddress)
        this.routes.get('/address', getAddress)

    }
}

export default new UserAddressRoutes().routes