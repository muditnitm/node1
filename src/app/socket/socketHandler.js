import redis from '../services/redisCacheBuilder'
import { calculateDistance, geoParser } from '../services/geoService'
import {
    DRIVER_NOT_FOUND,
    activeDrivers,
    DriverLoc,
    inProcessDrivers,
    inRideeDrivers,
    CONFIRMED,
    ONGOING,
    COMPLETED
} from '../config/constants'
import { socketErrorResponse, socketSuccessResponse } from './socketResponseHandler'
import User from '../models/user'
import Ride from '../models/rides'
import redisCacheBuilder from '../services/redisCacheBuilder';

export async function shareLocation(data, socket) {
    const driverId = await redis.getItem(`${activeDrivers}${socket['emp_id']}`)
    if (driverId) {
        return await redis.setLocation(`${DriverLoc}`, socket['emp_id'], data.lat, data.lang)
        // return await redis.getPosition(DriverLoc, socket['emp_id'])
    } else {
        throw new Error(DRIVER_NOT_FOUND)
    }
}

export async function setDriverStatus(data, socket) {
    if (data.active) {
        return await shareLocation(data, socket)
    } else {
        await redis.clearItem(`${DriverLoc}${socket['emp_id']}`)
        return await redis.clearItem(`${activeDrivers}${socket['emp_id']}`)
    }
}

export async function calculateFare(data, callback) {
    console.log("I m ere -----------------------------------------")
    let travelDistance = geoParser(await calculateDistance(data.pickupPosition, data.destinationPosition));
    if (travelDistance.status !== "OK") {
        throw new Error(travelDistance.status)
    }
    console.log(travelDistance.distance.value)
    socketSuccessResponse(callback, travelDistance.distance.value)
}
// process.nextTick(async () => {
//     try {
//         await calculateFare({ pickupPosition: { lat: '12.920434', lng: '77.621025' }, destinationPosition: { lat: '12.930413', lng: '77.615193' } }, (data) => {
//             console.log(data)
//         })

//     } catch (error) {
//         console.log(error)
//     }
// })

export async function getNearestDriver(data) {
    const closeDrivers = await redis.getCloseDrivers(DriverLoc, data.pickupPosition);
    if (closeDrivers.length < 1) {
        return { success: false, err: "No drivers found" }
    }
    // let travelDistance = geoParser(await calculateDistance(data.pickupPosition, data.dropPosition));
    // if (travelDistance.status !== "OK") {
    //     return { success: false, err: travelDistance.status }
    // }
    return { success: true, data: { distance: closeDrivers[0][1], drivers: closeDrivers } }
}

export async function requestRide(data, callback) {
    const response = await getNearestDriver(data)
    if (!response.success) {
        throw new Error('No drivers found')
    }
    const activeUser = await redis.getItem(`${activeDrivers}${+response.data.drivers[0][0]}`)
    if (!activeUser) {
        throw new Error('No drivers found')
    }
    socketSuccessResponse(callback, { distance: response.data.distance, cost: 45, time: 54 })
}

async function emitIncomingRIde(driver, data) {
    return new Promise(async (resolve, reject) => {
        try {
            const activeUser = await redis.getItem(`${activeDrivers}${+driver}`)
            if (!activeUser || !redisCacheBuilder.getSocket(`${activeDrivers}${+driver}`))
                return resolve(false)
            await redisCacheBuilder.clearItem(`${activeDrivers}${driver}`)
            await redisCacheBuilder.setItem(`${inProcessDrivers}${driver}`, { driver }, 1000000)
            redisCacheBuilder.getSocket(`${activeDrivers}${+driver}`).emit('incomingRide', data, async (err, status) => {
                await redisCacheBuilder.clearItem(`${inProcessDrivers}${driver}`)
                if (err || status['reject']) {
                    await redisCacheBuilder.setItem(`${activeDrivers}${driver}`, { driver }, 1000000)
                    return resolve(false)
                }
                await redisCacheBuilder.setItem(`${inRideeDrivers}${driver}`, { driver }, 1000000)
                return resolve(true)
            })

        } catch (error) {
            reject(false)
        }
    })
}

export async function bookRide(data, socket, callback) {
    const response = await getNearestDriver(data)
    if (!response.success) return socketErrorResponse(callback, response.err)
    for (let driver of response.data.drivers) {
        try {
            const accept = await emitIncomingRIde(driver[0], data)
            if (accept) {
                const user = await User.findOne({
                    where: {
                        id: +driver[0],
                        // role: 'DRIVER'               //TODO
                    },
                    attributes: { exclude: ['password', 'role', 'referralCode'] }
                })
                const rideDetails= await Ride.create({
                    source: "source",
                    destination: "destination",
                    distance: driver[1],
                    amount: 0,
                    status: CONFIRMED,
                    driver_id: user.id,
                    payment_method_id: 1,
                    user_id: socket['emp_id']
                })
                const driverSock = redisCacheBuilder.getSocket(driver[1])
                if(!driverSock)
                    
                return socketSuccessResponse(callback, { driver: user, distance: driver[1], ride_id: rideDetails.id })
            }
        } catch (error) {
            console.log(error)
        }
    }
    throw new Error('Currently no drivers are available near to you')
}

export async function driverArrived(data, socket, callback) {
    try {
        const rideDetails = await Ride.findOne({
            where: {
                driver_id: socket['emp_id'],
                status: CONFIRMED
            },
            attributes: { exclude: ['rideOtp', 'amount', 'status', 'reasonForCancel'] },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        if (!rideDetails) {
            throw new Error('No rides confirmed for you')
        }
        const riderSock = redisCacheBuilder.getSocket(rideDetails.user_id)
        if (!riderSock) {
            throw new Error('rider is no more available to take ride')
        }
        riderSock.emit('driverArrived', rideDetails)
        return socketSuccessResponse(callback, "intimated to rider")
    } catch (error) {
        console.log(error)
        throw new Error('Error while intimating rider')
    }
}

export async function startRide(data, callback) {
    try {
        const rideDetails = await Ride.findOne({
            where: {
                rideOtp: data.otp,
                status: CONFIRMED
            },
            attributes: { exclude: ['rideOtp', 'amount', 'status', 'reasonForCancel'] },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        if (!rideDetails) {
            throw new Error("Wrong/Invalid OTP, Please check")
        }
        const riderSock = redisCacheBuilder.getSocket(rideDetails.user_id)
        if (!riderSock) {
            throw new Error('rider is no more available to take ride')
        }
        await Ride.update({
            status: ONGOING,
        }, {
                where: {
                    rideOtp: data.otp
                }
            }
        )
        riderSock.emit('driverArrived', rideDetails)
        return socketSuccessResponse(callback, rideDetails)
    } catch (error) {
        throw new Error("error while starting ride")
    }
}
export async function finishRide(data, callback) {
    try {
        const rideDetails = await Ride.findOne({
            where: {
                driver_id: socket['emp_id'],
                rideOtp: data.otp,
                status: ONGOING
            },
            attributes: { exclude: ['rideOtp', 'status', 'reasonForCancel'] },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        if (!rideDetails) {
            throw new Error("Wrong/Invalid OTP, Please check")
        }
        const riderSock = redisCacheBuilder.getSocket(rideDetails.user_id)
        if (!riderSock) {
            throw new Error('rider is no more available to take ride')
        }
        await Ride.update({
            status: COMPLETED,
        }, {
                where: {
                    rideOtp: data.otp,
                    driver_id: socket['emp_id']
                }
            }
        )
        riderSock.emit('rideCompleted', rideDetails)
        return socketSuccessResponse(callback, rideDetails)
    } catch (error) {
        throw new Error("error while finishing ride")
    }
}

export async function driverReview(params) {
    
}