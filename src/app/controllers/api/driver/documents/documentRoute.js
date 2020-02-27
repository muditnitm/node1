import * as app from 'express'

import {
    uploadDoc, getDoc, deleteDoc
} from './documentController'

class DocumentRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.post('/uploadDoc', uploadDoc)
        this.routes.get('/getDoc', getDoc)
        this.routes.delete('/deleteDoc', deleteDoc)

    }
}

export default new DocumentRoutes().routes