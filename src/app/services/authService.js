import tokenService from './tokenService'
import { response_401, setResponse } from '../lib/apiResponseFormat'
import redis from './redisCacheBuilder'
import { socketErrorResponse, socketSuccessResponse } from '../socket/socketResponseHandler'
import { activeDrivers, activeUsers, DriverLoc, inProcessDrivers, inRideeDrivers } from '../config/constants'

export async function socketAuth(socket, data, callback) {
    console.log("authenticating...")
    const { token } = data;
    try {
        const payload = tokenService.verifyToken(token)
        if (payload) {
            console.log(JSON.stringify(payload))
            var canConnect;
            redis.addSocket(payload.id, socket)
            if (payload.role === 'USER')
                canConnect = redis.setItemIfNotExists(`${activeUsers}${payload.id}`, { socket: socket.id, emp_id: payload.id }, 8)
            else //if (payload.role === 'DRIVER')
                canConnect = redis.setItemIfNotExists(`${activeDrivers}${payload.id}`, { socket: socket.id, emp_id: payload.id }, 8)
            if (!canConnect) {
                return socketErrorResponse(callback, "ALREADY_LOGGED_IN")
            }
            socket['emp_id'] = payload.id
            socket['role'] = payload.role
            return socketSuccessResponse(callback, true)
        }
        return socketErrorResponse(callback, "UNAUTHORIZED")
    } catch (e) {
        console.log(`Socket ${socket.id} unauthorized.`)
        return socketErrorResponse(callback, "UNAUTHORIZED")
    }
}

export async function socketOnDisconn(socket) {
    console.log(`Socket ${socket.id} disconnected.`);
    try {
        await redis.clearItem(`${activeDrivers}${socket['emp_id']}`)
        await redis.clearItem(`${inRideeDrivers}${socket['emp_id']}`)
        await redis.clearItem(`${inProcessDrivers}${socket['emp_id']}`)
        if (socket['emp_id'])
            await redis.deleteLocation(DriverLoc, socket['emp_id'])
        redis.deleteSocket(socket['emp_id'])
        socket.disconnect()
    } catch (error) {
        console.log(error)
    }
}

export async function socketPostAuth(socket) {
    try {
        console.log(`Socket ${socket.id} authenticated.`)
        socket.conn.on('packet', async (packet) => {
            if (socket.auth && packet.type === 'ping') {
                redis.addSocket(socket['emp_id'], socket)
                const response = await redis.setItemOnlyExists(`${activeDrivers}${socket['emp_id']}`, { socket: socket.id, emp_id: socket['emp_id'] }, 8)
                // if (!response) return socket.disconnect()
                // console.log("ping", socket['emp_id'])
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export function adminAuthentication(req, res, next) {
    // req['emp_id'] = 1
    // return next()
    const payload = tokenService.verifyToken(req.headers['authorization'])
    if (payload && payload.role === 'ADMIN') {
        req['emp_id'] = payload.id
        req['role'] = 'ADMIN'
        next()
    } else {
        return setResponse(res, response_401("User is un-authorised, Please login"))
    }
}

export function userAuthentication(req, res, next) {
    const payload = tokenService.verifyToken(req.headers['authorization'])
    // req['emp_id'] = 1
    // req['role'] = 'ADMIN'
    // return next()
    if (payload && (payload.role === 'USER' || payload.role === 'ADMIN')) {
        req['emp_id'] = payload.id
        req['role'] = payload.role
        next()
    } else {
        return setResponse(res, response_401("User is un-authorised, Please login"))
    }
}

export function driverAuthentication(req, res, next) {
    const payload = tokenService.verifyToken(req.headers['authorization'])
    // req['emp_id'] = 1
    // req['role'] = 'ADMIN'
    // return next()
    if (payload && (payload.role === 'DRIVER' || payload.role === 'ADMIN')) {
        req['emp_id'] = payload.id
        req['role'] = payload.role
        next()
    } else {
        return setResponse(res, response_401("User is un-authorised, Please login"))
    }
}
