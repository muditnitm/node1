import * as app from 'express'

import {
    addToWallet
} from './userWalletController'

class UserWalletRoute {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.post('/addToWallet', addToWallet)
    }
}

export default new UserWalletRoute().routes