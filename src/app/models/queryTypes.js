import { Sequelize, sequelize } from '../config/db'


var QueryTypes = sequelize.define('QueryTypes', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
        freezeTableName: true,
        tableName: "query_types",
        paranoid: true
    });

export default QueryTypes