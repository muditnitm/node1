import { Sequelize } from './db'

export default {
    getCouponsPerUser: {
        query: 'select cp.name, cp.code, cp.description, cp.discount, cp.type, cp.maxDiscount, cp.expiryDate \
        from coupons cp, user_coupons up \
        where ((cp.id = up.coupon_id \
        and up.user_id = :user_id ) \
        OR (cp.all = 1)) \
        and up.deletedAt is null ',
        // and expiryDate >= now()',
        type: Sequelize.QueryTypes.SELECT
    }
}