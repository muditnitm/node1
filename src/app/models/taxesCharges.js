import { Sequelize, sequelize } from '../config/db'

const TaxesCharges = sequelize.define('TaxesCharges', {
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
    amount: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    modified_by: {
        type: Sequelize.DOUBLE,
        allowNull: true
    }
}, {
        freezeTableName: true,
        tableName: "taxes_charges",
        paranoid: true
    });

export default TaxesCharges