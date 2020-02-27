import Coupon from '../../../../models/coupon'
import UserCoupons from '../../../../models/userCoupons'
import { response_200, response_500, setResponse } from '../../../../lib/apiResponseFormat'
import Queries from '../../../../config/properties'
import { executeNativeQuery, sequelize } from '../../../../config/db'
import User from '../../../../models/user';


export async function getCoupons(req, res) {
    try {
        const coupons = await Coupon.findAll({
            where: {
                deletedAt: null,
                expiryDate: {
                    $gte: new Date().getTime()
                }
            },
            include: [
                { model: User, as: "users" }
            ]
        })
        setResponse(res, response_200(coupons))
    } catch (error) {
        setResponse(res, response_500([], error.message))
    }
}

export async function addCoupon(req, res) {
    try {
        const coupon = await Coupon.create({
            name: req.body.name,
            code: req.body.code,
            discount: req.body.discount,
            type: req.body.type,
            maxDiscount: req.body.maxDiscount,
            expiryDate: req.body.expiryDate,
            description: req.body.description,
            all: req.body.all
        })
        await addCouponToUsers(coupon.id, req.body.users)
        setResponse(res, response_200("coupon created"))
    } catch (error) {
        setResponse(res, response_500({ coupon: null }, error.message))
    }
}

export async function updateCoupon(req, res) {
    try {
        const coupon = await Coupon.update({
            name: req.body.name,
            code: req.body.code,
            discount: req.body.discount,
            type: req.body.type,
            maxDiscount: req.body.maxDiscount,
            expiryDate: req.body.expiryDate,
            description: req.body.description,
            all: req.body.all
        }, {
                where: {
                    id: req.body.id
                }
            })
        await addCouponToUsers(req.body.id, req.body.users)
        setResponse(res, response_200({ coupon }))
    } catch (error) {
        setResponse(res, response_500({ coupon: null }, error.message))
    }
}

export async function getUserCoupons(req, res) {
    try {
        const response = await executeNativeQuery(Queries.getCouponsPerUser, { user_id: req['emp_id'] })
        setResponse(res, response_200({ response }))
    } catch (error) {
        setResponse(res, response_500({ response: null }, error.message))
    }
}

export async function applyCoupon(req, res) {
    try {
        var query = ` and expiryDate >= now() and cp.code='${req.body.code}'`
        if (req.body.coupon_id) {
            query += ` and up.coupon_id = ${req.body.coupon_id}`
        }
        const response = await executeNativeQuery(
            {
                type: Queries.getCouponsPerUser.type,
                query: Queries.getCouponsPerUser.query + query
            },
            {
                user_id: req['emp_id']
            })
        console.log(response)
        if (response && response.length > 0) {
            return setResponse(res, response_200("Coupon applied successfully"))
        }
        return setResponse(res, response_500("coupon expired/Invalid"))
    } catch (error) {
        setResponse(res, response_500({ response: null }, error.message))
    }
}

export async function mapCouponToUsers(req, res) {
    try {
        const coupon = await Coupon.findOne({
            where: {
                id: req.body.coupon_id,
                code: req.body.code,
                expiryDate: {
                    $gte: new Date()
                }
            }
        })
        if (coupon) {
            const user_coupons_map = req.body.users && req.body.users.map(user => { return { user_id: user, coupon_id: coupon.id } })
            await UserCoupons.bulkCreate(user_coupons_map)
            return setResponse(res, response_200("coupons mapped to users successfully"))
        }
        return setResponse(res, response_500("Specified coupon not found"))
    } catch (error) {
        setResponse(res, response_500("Error while mapping coupons to users", error.message))
    }
}

async function addCouponToUsers(coupon_id, users) {
    const user_coupons_map = users && users.map(user => { return { user_id: user, coupon_id } })
    return await sequelize.transaction(t => {
        return Promise.all([
            UserCoupons.destroy({
                where: {
                    coupon_id,
                    user_id: {
                        $notIn: users
                    }
                }
            },t),
            UserCoupons.bulkCreate(user_coupons_map, {
                updateOnDuplicate: ["user_id", "coupon_id", "deletedAt"],
            }, t)
        ])
    })
}

