import { Sequelize, sequelize } from '../config/db'
import PaymentMethod from './paymentMethod'
import {generateOTP} from '../services/otpManager'

const Rides = sequelize.define('RIDE', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    source: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    destination: {
        type: Sequelize.STRING(125),
        allowNull: false
    },
    distance: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    rideOtp:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING(128),
        allowNull: false,
        defaultValue: 'BOOKED',
        validate: {
            isIn: ['BOOKED', 'COMPLETED', 'ONGOING', 'RIDERCANCELLED', 'DRIVERCANCELLED', 'CONFIRMED']
        }
    },
    reasonForCancel: {
        type: Sequelize.STRING(500),
        allowNull: true
    }
}, {
    freezeTableName: true,
    tableName: "rides",
    paranoid: true,
    hooks: {
        beforeCreate: (ride) => {
            ride.rideOtp = generateOTP()
        }
    }
});

Rides.belongsTo(PaymentMethod, {foreignKey: 'payment_method_id'})

export default Rides