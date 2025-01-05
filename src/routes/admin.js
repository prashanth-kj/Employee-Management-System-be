import express from 'express'
import Auth from '../common/auth.js'
import adminController from '../controller/admin.js'

const router = express.Router()

router.post('/employee',Auth.validate,Auth.adminGuard,adminController.createEmployee)
router.put('/employee/:id',Auth.validate,Auth.adminGuard,adminController.updateEmployee)
router.delete('/employee/delete/:id',Auth.validate,Auth.adminGuard,adminController.deleteEmployee)

router.post('/employee/create',Auth.validate,Auth.adminGuard,adminController.createTask)
router.put('/employee/task/:id',Auth.validate,Auth.adminGuard,adminController.updateTask)
router.delete('/employee/task/delete/:id',Auth.validate,Auth.adminGuard,adminController.deleteTask)

router.get('/employees',Auth.validate,Auth.adminGuard,adminController.getAllEmployees)
router.get('/employee/tasks',Auth.validate,Auth.adminGuard,adminController.getAllTasks)
router.get('/employee/performance',Auth.validate,Auth.adminGuard,adminController.getEmployeePerformance)

router.get('/employee/task/:id',Auth.validate,Auth.adminGuard,adminController.getTaskById)
router.post('/employee/task/:id/assign', Auth.validate, Auth.adminGuard, adminController.assignTaskToEmployee);
router.post('/employee/report/:id',Auth.validate,Auth.adminGuard,adminController.generateWorkReport)

router.get('/employee/timelog/:id',Auth.validate,Auth.adminGuard,adminController.getTimelogById)
router.put('/employee/timelog/:id/:status',Auth.validate,Auth.adminGuard,adminController.updateTimelogStatus)
router.get('/employee/:id/tasks',Auth.validate,Auth.adminGuard,adminController.getEmployeeTasks)
router.get('/employee/:id',Auth.validate,Auth.adminGuard,adminController.getEmployeeById)



export default router





