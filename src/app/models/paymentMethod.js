import { Sequelize, sequelize } from '../config/db'

const PaymentMethods = sequelize.define('PaymentMethods', {
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
    url: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    tableName: "payment_methods",
    paranoid: true
});

export default PaymentMethods