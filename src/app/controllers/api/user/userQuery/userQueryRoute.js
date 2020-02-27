import * as app from 'express'

import {
    postQuery,
    getAllQuery,
    updateQuery,
    replyToQuery,
    getQueryTypes
} from './userQueryController'

class UserQueryRoute {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.post('/query', postQuery)
        this.routes.get('/query', getAllQuery)
        this.routes.put('/query', updateQuery)
        this.routes.post('/replyToQuery', replyToQuery)
        this.routes.get('/getQueryTypes', getQueryTypes)
    }
}

export default new UserQueryRoute().routes