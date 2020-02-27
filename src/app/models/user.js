import bcrypt from 'bcrypt'
import crypto from 'crypto'

import Documents from './documents'
import Rides from './rides'
import { Sequelize, sequelize } from '../config/db'
import Locations from './locations'
import EmergencyContact from './emergencyContact'
import Address from './address'
import UserQuery from './userQuery'
import WalletTransaction from './walletTransaction'
import Vehicle from './vehicle'


var User = sequelize.define('USER', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pno: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    referralCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    countryCode: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '+91'
    },
    profilePhoto: {
        type: Sequelize.STRING,
        allowNull: true,

    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['USER', 'DRIVER', 'ADMIN']],
                msg: 'Must be valid role'
            }
        }
    },
    dl_no: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    adhar_no: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    dob: {
        type: Sequelize.DATE,
        allowNull: true
    },
    wallet: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING(25),
        allowNull: false,
        validate: {
            isIn: {
                args: [['MALE', 'FEMALE', 'OTHERS']],
                msg: 'gender must valid one'
            }
        }
    }
}, {
        freezeTableName: true,
        tableName: "users",
        paranoid: true,
        hooks: {
            beforeCreate: (user) => {
                const salt = bcrypt.genSaltSync()
                user.password = bcrypt.hashSync(user.password, salt)
                user.referralCode = crypto.randomBytes(4).toString('hex')
            }
        }
    });

User.prototype.validatePassword = (encyPassword, password) => {
    return bcrypt.compareSync(password, encyPassword)
}

User.hasMany(Documents, { foreignKey: 'user_id', as: 'documents' })
User.hasMany(Rides, { foreignKey: 'user_id', as: 'rides' })
User.hasOne(Rides, { foreignKey: 'driver_id', as: 'driver' })
User.hasMany(Locations, { foreignKey: 'user_id', as: 'locations' })
User.hasMany(EmergencyContact, { foreignKey: 'user_id' })
User.hasMany(Address, { foreignKey: 'user_id', as: 'address' })
User.hasMany(UserQuery, { foreignKey: 'user_id', as: 'tickets' })
User.hasMany(WalletTransaction, { foreignKey: 'user_id', as: "transactions" })
User.hasOne(Vehicle, { foreignKey: 'user_id', as: 'vehicle' })

export default User