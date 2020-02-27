import * as redis from 'redis'
import blueBird from 'bluebird'
import env from '../../../config/env'
import logger from '../lib/logger'

blueBird.promisifyAll(redis)

class RedisCacheBuilder {
    constructor() {
        try {
            this.sockets = {}
            this.cache = redis.createClient({
                port: env.redisPort,
                host: env.redisHost
            })
        } catch (error) {
            logger.error(`error while connecting to redis: ${error}`)
        }
        this.cache.on('connect', () => {
            logger.info(`connected to redis`)
        })
        this.cache.on('error', (err) => {
            logger.error(err)
        })
    }

    async getPosition(key, driverId) {
        return await this.cache.geoposAsync(key, driverId)
    }

    async getCloseDrivers(key, position) {
        return await this.cache.georadiusAsync(key, position.x, position.y, process.env.MAX_DISTANCE_TO_SEND_REQUEST, 'km', 'WITHDIST', 'WITHCOORD', 'ASC');
    }

    async deleteLocation(key, userId) {
        await this.cache.zremAsync(key, userId);
    }

    async setLocation(key, userId, lat, lng) {
        return await this.cache.geoaddAsync(key, lat, lng, userId);
    }

    async setItemIfNotExists(key, value, exp) {
        return await this.cache.setAsync(key, JSON.stringify(value), 'NX', 'EX', exp)
    }

    addSocket(key, value) {
        this.sockets[key] = value
    }

    getSocket(key) {
        return this.sockets[key]
    }

    deleteSocket(key) {
        this.sockets[key] = undefined
    }

    async setItem(key, value, exp) {
        return await this.cache.setAsync(key, JSON.stringify(value), 'EX', exp)
    }

    async setItemOnlyExists(key, value, exp) {
        await this.cache.expireAsync(key, exp)
        return await this.cache.setAsync(key, JSON.stringify(value), 'XX', 'EX', exp)
    }

    async getItem(key) {
        const data = await this.cache.getAsync(key)
        if (data) return JSON.parse(data)
        return data
    }

    async clearItem(key) {
        await this.cache.delAsync(key)
    }
    clearAll() {
        throw new Error("Method not implemented.")
    }
}

export default new RedisCacheBuilder()