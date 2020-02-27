import { Router } from 'express'
import documentRoute from './documents/documentRoute';
import driverAuthRoute from './driverAuth/driverAuthRoute';


const router = Router()

router.use('/docs', documentRoute)
router.use('/auth', driverAuthRoute)

export default router