import { Sequelize, sequelize } from '../config/db'

import PaymentMethod from './paymentMethod'


var WalletTransaction = sequelize.define('WalletTransaction', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    json: {
        type: Sequelize.STRING(255),
    }
}, {
        freezeTableName: true,
        tableName: "wallet_transaction",
        paranoid: true
    });

WalletTransaction.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id' })

export default WalletTransaction