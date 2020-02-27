import { Sequelize, sequelize } from '../config/db'
import QueryReply from './queryeply'
import QueryTypes from './queryTypes'

var Vehicle = sequelize.define('Vehicle', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    model: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    brand: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    registration_no: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
}, {
        freezeTableName: true,
        tableName: "vehicles",
        paranoid: true
    });

export default Vehicle