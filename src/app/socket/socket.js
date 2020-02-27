import logger from '../lib/logger'
import {
    shareLocation,
    setDriverStatus,
    calculateFare,
    bookRide,
    requestRide,
    driverArrived,
    startRide
} from './socketHandler'
import { socketErrorResponse } from './socketResponseHandler'

module.exports = {
    handleIoOps: (io) => {
        io.on('connection', (socket) => {
            // socket.loggedIn = false;
            logger.info("New User conneced1");
            console.log("New User conneced1");

            socket.on('shareLoc', async (data, callback) => {
                try {
                    await shareLocation(data, socket)
                    return callback(null, true)
                } catch (error) {
                    return socketErrorResponse(callback, error.message)
                }
            });

            socket.on('driverStatus', async (data, callback) => {
                try {
                    await setDriverStatus(data, socket)
                    return callback(null, true)
                } catch (error) {
                    return socketErrorResponse(callback, error.message)
                }
            });

            socket.on('calculateFare', async (data, callback) => {
                try {
                    await calculateFare(data, callback)
                } catch (error) {
                    return socketErrorResponse(callback, error.message)
                }
            });

            socket.on('bookRide', async (data, callback) => {
                try {
                    await bookRide(data, socket, callback)
                } catch (error) {
                    return socketErrorResponse(callback, error.message)
                }
            });

            socket.on('requestRide', async (data, callback) => {
                try {
                    await requestRide(data, callback)
                } catch (error) {
                    console.log(error)
                    return socketErrorResponse(callback, error.message)
                }
            });

            socket.on("arrived@Pickup", async (data, callback) => {
                try {
                    await driverArrived(data, callback)
                } catch (error) {
                    console.log(error)
                    return socketErrorResponse(callback, error.message)
                }
            });

            socket.on("startRide", async (data, callback) => {
                try {
                    await startRide(data, callback)
                } catch (error) {
                    console.log(error)
                    return socketErrorResponse(callback, error.message)
                }
            })
            
            socket.on("finishRide", async (data, callback) => {
                try {
                    await startRide(data, callback)
                } catch (error) {
                    console.log(error)
                    return socketErrorResponse(callback, error.message)
                }
            })

        })
    }
}