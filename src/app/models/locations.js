import { Sequelize, sequelize } from '../config/db'


var Locations = sequelize.define('LOCATION', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    lattitude: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    langitude: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    address: {
        type: Sequelize.STRING(500),
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "locations",
    paranoid: true
});

export default Locations