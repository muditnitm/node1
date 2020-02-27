const env = process.env.NODE_ENV || "development"
import {readFileSync} from 'fs'

const configs = {
    base: {
        env,
        host: '0.0.0.0',
        port: 3000,
        dbPort: 3306,
        secret: "secretKey for sessions",
        dialect: 'mysql',
        issuer : 'Mysoft corp',
        subject : 'some@user.com',
        audience : 'http://mysoftcorp.in',
        _private_key : readFileSync('private.key', 'utf8'),
        _public_key : readFileSync('public.key', 'utf8'),
        tokenExpiresIn: '1d',
        tokenGenAlg: 'RS256',
        redisHost: '127.0.0.1',
        redisPort: 6379,
        cacheExpire_time: 100000
    },
    development: {
        port: 3000,
        dbUser: 'root',
        dbPassword: 'root',
        database: 'rapido',

    },
    smoke: {
        port: 3000,
        dbUser: 'root',
        dbPassword: 'root',
        database: 'rapido',
    },
    integration: {
        port: 3000,
        dbUser: 'root',
        dbPassword: 'root',
        database: 'rapido',
        host: '0.0.0.0',
    },
    production: {
        port: 3000,
        dbUser: 'root',
        dbPassword: 'root',
        database: 'rapido',
        adminEmail: 'admin@gmail.com',
        toEmail: 'admin@gmail.com',
        mailHost: 'smtp.ethereal.email'
    }
};

const config = Object.assign(configs.base, configs[env]);

module.exports= config;
