import { Sequelize, sequelize } from '../config/db'


var QueryReply = sequelize.define('QueryReply', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    description: {
        type: Sequelize.STRING(525),
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "query_reply",
    paranoid: true
});

export default QueryReply