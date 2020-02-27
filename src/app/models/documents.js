import { Sequelize, sequelize } from '../config/db'


var Documents = sequelize.define('DOCUMENT', {
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
    url: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    type: {
        type: Sequelize.STRING(125),
        allowNull: true
    },
    verifiedByAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    reasonForReject: {
        type: Sequelize.STRING(500),
        allowNull: true
    }
}, {
    freezeTableName: true,
    tableName: "documents",
    paranoid: true
});

export default Documents