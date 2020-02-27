import express from 'express'
import socket from 'socket.io'
import env from 'dotenv'
import https from 'https'
import fs from 'fs'
import path from 'path'

import { handleIoOps } from './app/socket/socket'
import { socketAuth, socketOnDisconn, socketPostAuth } from './app/services/authService'

import socketIoAuth from 'socketio-auth'
import applyMiddleWares from './server'
import config from '../config/env'

env.config()
var app = express();
/* 
    *to initialize the angular project
*/
var options = {
    key: fs.readFileSync(path.resolve('dist/src/client-key.pem'), 'utf8'),
    cert: fs.readFileSync(path.resolve('dist/src/client-cert.pem'), 'utf8')
}   

app.use(express.static(__dirname + "/public"));
app.use('/', express.static(__dirname + "/public/index.html"));
// Start server
if (!module.parent) {
    // var httpServer = app.listen(config.port, config.host, () => {
    //     console.log(`Hello Moto service API server listening on ${config.host} : ${config.port}, in ${config.env}`)
    // })
    var httpsServer = https.createServer(options, app).listen(8443, (err) => {
        console.log(`Hello Moto service API server listening on ${config.host} : ${config.port}, in ${config.env}`)
    })
}
const httpsio = socket(httpsServer, {
    // pingTimeout: 7000,
    pingInterval: 5000
})
// const httpio = socket(httpServer, {
//     // pingTimeout: 7000,
//     pingInterval: 5000
// })
// apply middlewares
socketIoAuth(httpsio, {
    authenticate: socketAuth,
    postAuthenticate: socketPostAuth,
    disconnect: socketOnDisconn
})
handleIoOps(httpsio)
// socketIoAuth(httpio, {
//     authenticate: socketAuth,
//     postAuthenticate: socketPostAuth,
//     disconnect: socketOnDisconn
// })
// handleIoOps(httpio)
applyMiddleWares(app)
// export const socketIo = io
