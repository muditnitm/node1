import * as app from 'express'

import { updateCharges, getAllCharges } from './taxesChargesController'

class TaxesChargesRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.put('/updateCharges', updateCharges)
        this.routes.get('/getAllCharges', getAllCharges)
    }
}

export default new TaxesChargesRoutes().routes