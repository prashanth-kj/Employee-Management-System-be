import express from 'express'
import Auth from "../common/auth.js"
import taskController from '../controller/task.js'


const router = express.Router()

router.post('/create',Auth.validate, taskController.createTask)
router.put('/edit/:id',Auth.validate,taskController.updateTask)
router.put('/:id/status/:status',Auth.validate, taskController.updateTaskStatus)
router.get('/list',Auth.validate, taskController.getAllUserTask)
router.get('/performance',Auth.validate,taskController.getOverallPerformance)
router.get('/:id',Auth.validate, taskController.getTaskById)

router.delete('/delete/:id',Auth.validate,taskController.deleteTask)


export default router