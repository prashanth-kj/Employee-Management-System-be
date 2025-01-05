import express from 'express'
import employeeRoutes from './employee.js'
import taskRoutes from './task.js'
import timelogRoutes from './timelog.js'
import adminRoutes from './admin.js'


const router = express.Router()

router.use('/employee',employeeRoutes)
router.use('/task',taskRoutes)
router.use('/timelog',timelogRoutes)
router.use('/admin',adminRoutes)

export default router


