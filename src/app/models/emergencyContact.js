import { Sequelize, sequelize } from '../config/db'


var EmergencyContact = sequelize.define('EmergencyContact', {
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
    contact: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
        freezeTableName: true,
        tableName: "emergency_contact",
        paranoid: true
    });

export default EmergencyContact