import { Sequelize, sequelize } from '../config/db'

var UserCoupons = sequelize.define('UserCoupons', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }, user_id: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
    }, coupon_id: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
    }
}, {
        freezeTableName: true,
        tableName: "user_coupons",
        paranoid: true
    });


export default UserCoupons