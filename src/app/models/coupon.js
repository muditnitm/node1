import { Sequelize, sequelize } from '../config/db'
import User from './user';

var Coupon = sequelize.define('COUPON', {
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
    code: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(125),
    },
    discount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING(25),
        allowNull: false,
        validate: {
            isIn: {
                args: [['FLAT', 'PERCENTAGE']]
            }
        }
    },
    maxDiscount: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    expiryDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    all: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
        freezeTableName: true,
        tableName: "coupons",
        paranoid: true
    });


export default Coupon