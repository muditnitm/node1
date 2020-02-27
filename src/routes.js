import { Router } from 'express'
import userAuthRoutes from './app/controllers/api/user/userAuth/userAuthRoute'
import userAddressRoutes from './app/controllers/api/user/userAddress/userAddressRoute'
import AdminRoutes from './app/controllers/api/admin/userManagement/userManagementRoute'
import { userAuthentication, adminAuthentication } from './app/services/authService'
import UserQuery from './app/controllers/api/user/userQuery/userQueryRoute'
import UserWalletRoute from './app/controllers/api/user/userWallet/userWalletRoute'
import UserRideBooking from './app/controllers/api/user/rideBooking/rideBookingRoute'
import couponRoute from './app/controllers/api/user/coupons/couponRoute'
import TaxesChargesRoute from './app/controllers/api/admin/taxesCharges/taxesChargesRoute'
import driverRoutes from './app/controllers/api/driver/driverRoutes'


const router = Router()

router.use('/user', userAuthRoutes)
router.use('/driver', driverRoutes)
router.use('/userAddress', userAuthentication, userAddressRoutes)
router.use('/admin', AdminRoutes)
router.use('/userQuery', userAuthentication, UserQuery)
router.use('/userWallet', userAuthentication, UserWalletRoute)
router.use('/userRides', userAuthentication, UserRideBooking)
router.use('/coupons', userAuthentication, couponRoute)
router.use('/charges', adminAuthentication, TaxesChargesRoute)

export default router