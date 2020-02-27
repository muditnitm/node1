import { Sequelize, sequelize } from '../config/db'
import QueryReply from './queryeply'
import QueryTypes from './queryTypes'

var UserQuery = sequelize.define('UserQuery', {
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
    description: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    status: {
        type: Sequelize.STRING(25),
        allowNull: false,
        defaultValue: 'PENDING',
        validate: {
            isIn: {
                args: [['PENDING', 'INPROGRESS', 'RESOLVED']],
                msg: "must be an valid status"
            }
        }
    }
}, {
        freezeTableName: true,
        tableName: "user_query",
        paranoid: true
    });

UserQuery.hasMany(QueryReply, { foreignKey: 'query_id' })
UserQuery.belongsTo(QueryTypes, { foreignKey: 'query_type' })

export default UserQuery