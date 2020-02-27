import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
import swaggerUi from 'swagger-ui-express'

import apiRouter from './routes'
import logger from './app/lib/logger'
import swaagerDoc from './swagger.json'
import User from './app/models/user'
import Coupon from './app/models/coupon'
import UserCoupons from './app/models/userCoupons'
import fileUpload from 'express-fileupload'

User.belongsToMany(Coupon, {
    as: 'coupons',
    through: UserCoupons,
    foreignKey: 'user_id'
});
Coupon.belongsToMany(User, {
    as: 'users',
    through: UserCoupons,
    foreignKey: 'coupon_id'
});


async function logRequest(request, response, next) {
    logger.info('###### REQUEST #######');
    logger.info(`END POINT : ${request.url}`);
    logger.info('Query : ', request.query);
    logger.info('Post : ', request.body);
    logger.info('Params : ', request.params);
    logger.info('###### END OF REQUEST #######');
    await next();
}

async function logResponse(request, response, next) {
    const start = Date.now();
    await next();
    logger.info('###### RESPONSE #######');
    logger.info('Body : ', response.body);
    const end = Date.now() - start;
    logger.info(`Response time : ${end} ms`);
    logger.info('###### END OF RESPONSE #######');
}



// apply the required middlewares for the application
var applyMiddleWares = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(fileUpload());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser())

    app.use(logRequest);
    app.use(logResponse);
    app.use('/rapido/api', apiRouter)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaagerDoc));
    app.use(function (req, res) {
        res.status(404).send({ url: req.originalUrl + ' not found' })
    });
};


//create a mail for 
var transport = nodemailer.createTransport({ // [1]
    service: "Gmail",
    auth: {
        user: "username",
        pass: "password"
    }
});
if (process.env.NODE_ENV === 'production') { // [2]
    process.on('uncaughtException', function (er) {
        logger.error(er)
        //   console.error("Inside mailer", transport) // [3]
        // transport.sendMail({
        //     from: 'ajaykumarmp145@gmail.com',
        //     to: 'ajaykumarmp145@gmail.com',
        //     subject: "HI",
        //     text: "Hello" // [4]
        // }, function (er) {
        //     if (er) console.error()
        //     // uncomment this if you want shutdown system after exception occured
        //     // process.start();// [5]
        // })
    })
}

module.exports = applyMiddleWares;