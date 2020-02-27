import * as app from 'express'

import {
    getCoupons,
    addCoupon,
    updateCoupon,
    getUserCoupons,
    mapCouponToUsers,
    applyCoupon
} from './couponController'

class CouponsRoutes {

    constructor() {
        this.routes = app.Router()
        this.mountRoutes()
    }

    mountRoutes() {
        this.routes.get('/getCoupons', getCoupons)
        this.routes.post('/addCoupon', addCoupon)
        this.routes.put('/updateCoupon', updateCoupon)
        this.routes.get('/getUserCoupons', getUserCoupons)
        this.routes.post('/mapCouponToUsers', mapCouponToUsers)
        this.routes.post('/applyCoupon', applyCoupon)

    }
}

export default new CouponsRoutes().routes