import { uploadToS3, getData, deleteDocument } from '../../../../services/awsProvider'
import UserDoc from '../../../../models/documents'
import User from '../../../../models/user'
import Vehicle from '../../../../models/vehicle'
import { response_200, response_500, setResponse } from '../../../../lib/apiResponseFormat'
import Logger from '../../../../lib/logger';
import { sequelize } from '../../../../config/db';

export async function registerDriver(req, res) {
    try {
        var user_id
        const vehicle = JSON.parse(req.body.vehicle)
        if (req.body.id) {
            user_id = req.body.id
            await sequelize.transaction(t =>
                Promise.all([
                    User.update({
                        username: req.body.username,
                        email: req.body.email,
                        pno: req.body.pno,
                        countryCode: req.body.countryCode,
                        gender: req.body.gender,
                        dob: new Date(req.body.dob).getTime(),
                        dl_no: req.body.dl_no,
                        adhar_no: req.body.adhar_no,
                        deletedAt: req.body.active === 'true' || req.body.active === true ? null : new Date().getTime()
                    }, {
                            where: {
                                id: req.body.id
                            },
                            paranoid: false,
                        }, t),
                    Vehicle.update({
                        name: vehicle.name,
                        model: vehicle.model,
                        brand: vehicle.brand,
                        registration_no: vehicle.registration_no,
                    }, {
                            where: {
                                user_id: req.body.id
                            }
                        }, t)

                ]))
        } else {
            const user = await User.create({
                username: req.body.username,
                email: req.body.email,
                pno: req.body.pno,
                role: 'DRIVER',
                countryCode: req.body.countryCode,
                referralCode: '',
                password: '',
                gender: req.body.gender,
                dob: new Date(req.body.dob).getTime(),
                dl_no: req.body.dl_no,
                adhar_no: req.body.adhar_no,
                deletedAt: req.body.active === 'true' || req.body.active === true ? null : new Date().getTime()
            })
            user_id = user.id
            await Vehicle.create({
                name: vehicle.name,
                model: vehicle.model,
                brand: vehicle.brand,
                registration_no: vehicle.registration_no,
                user_id: user.id
            })
        }
        req.files && Object.entries(req.files).map(async (value) => {
            const url = await uploadToS3(`driver/${user_id}/${value[0]}_${value[1].name}`, value[1].data, value[0] !== 'profilePhoto')
            if (value[0] === 'profilePhoto')
                await User.update({
                    profilePhoto: url
                }, {
                        where: {
                            id: user_id
                        },
                        paranoid: false
                    })
            else
                await UserDoc.create({
                    name: value[1].name,
                    url,
                    verifiedByAdmin: true,
                    type: value[0],
                    user_id: user_id
                })
        })
        Logger.info(`Driver Registered successfully: ${user_id}`)
        setResponse(res, response_200(`Driver details ${req.body.id ? 'updated' : 'created'} successfully`))
    } catch (error) {
        Logger.error(`Error while ${req.body.id ? 'updated' : 'created'} driver: ${error}`)
        setResponse(res, response_500(`Error while ${req.body.id ? 'updated' : 'created'} driver: ${error}`))
    }
}