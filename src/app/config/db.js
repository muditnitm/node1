import { Sequelize } from 'sequelize'

import env from '../../../config/env'
import Logger from '../lib/logger'

const sequelize = new Sequelize(env.database, env.dbUser, env.dbPassword, {
    dialect: env.dialect,
    port: env.dbPort,
    timezone: 'asia/kolkata'
})

sequelize
    .authenticate()
    .then((success) => {
        console.log("conntected  to databse")
    }, (err) => {
        console.log("error in conntecting  to databse", err)
    });

sequelize
    .sync({ force: false })
    .then((success) => {
        console.log("syncing is done")
    }, (err) => {
        console.log("error databse syncing", err)
    })

export async function executeNativeQuery({ type, query }, replacements = undefined) {
    try {
        const result = await sequelize.query(query, { replacements, type })
        return result
    } catch (error) {
        Logger.error(`Error while executing native query: ${error}`)
        return false
    }

}

export {
    sequelize,
    Sequelize
}
