import express from 'express'
import timelogController from '../controller/timelog.js'
import Auth from '../common/auth.js'

const router = express.Router()

router.post('/clock-in',Auth.validate,timelogController.clockIn)
router.post('/clock-out',Auth.validate,timelogController.clockOut)
router.get('/list',Auth.validate,timelogController.getTimelogs)
router.get('/totalwork',Auth.validate,timelogController.totalWorkhourPerDay)
router.get('/workchart',Auth.validate,timelogController.getEmployeeWorkHoursByDate)
router.post('/report',Auth.validate,timelogController.generateWorkReport)

export default router


