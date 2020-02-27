import { Sequelize, sequelize } from '../config/db'


var Address = sequelize.define('ADDRESS', {
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
    type: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    lattitude: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    langitude: {
        type: Sequelize.STRING(125),
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "address",
    paranoid: true
});

export default Address