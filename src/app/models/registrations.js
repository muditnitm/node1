import { Sequelize, sequelize } from '../config/db'


var Registrations = sequelize.define('REGISTRATIONS', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    otp: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    pno: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    status: {
        type: Sequelize.STRING(25),
        allowNull: false,
        defaultValue: 'PENDING'
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    expiry_date: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "registrations",
    paranoid: true
});

export default Registrations