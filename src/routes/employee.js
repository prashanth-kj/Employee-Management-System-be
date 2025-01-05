import express from 'express'
import employeeController from '../controller/employee.js'
import Auth from '../common/auth.js'

const router = express.Router()

router.post('/register',employeeController.createEmployee)
router.post('/login',employeeController.login)
router.get('/profile',Auth.validate,employeeController.getprofile)
router.put('/profile/edit',Auth.validate,employeeController.updateprofile)
router.post('/forget-password',employeeController.forgetPassword);
router.post('/reset-password',employeeController.resetPassword);

export default router
