import TaskModel from "../model/task.js";
import { Status } from "../common/utils.js";
import EmployeeModel from "../model/employee.js";

const createTask=async(req,res)=>{
    try {
        let {title,description,project,deadline}=req.body;

        if(title && description && project && deadline ){
           
           let newTask = new TaskModel({
              title:title,
              description:description,
              project:project,
              deadline:deadline,
              createdBy:req.headers.userId
           })
            await newTask.save()
           
       
           res.status(200).json({
             message:"new task created sucessfully",
             newTask
           })

        }else{
            res.status(400).json({
                message:"All data field is required"
            })
        }


    } catch (error) {
        console.log(error)
    }

}
  
const updateTask=async(req,res)=>{
    try {
        let taskId=req.params.id;
        if(taskId){
             
            let task= await TaskModel.findById(taskId);

            if(task){
                let {title,description,project,deadline}=req.body

                 task.title=title,
                 task.description=description,
                 task.project=project,
                 task.deadline=deadline
                 task.modifiedBy=req.headers.userId
                 task.modifiedAt=Date.now()

                 await task.save()

                 res.status(200).json({
                    message:"task updated sucessfully",
                    task
                 })

            }else{
                res.status(400).json({
                    message:"Task not found"
                })
            }
        }else{
            res.status(400).json({
                message:"Task id not found"
            })
        }
       
    } catch (error) {
        console.log(error)
    }

}

const updateTaskStatus=async(req,res)=>{
    try {
        let taskId = req.params.id;
        let status = req.params.status;

        if(taskId && status){
             
            let task = await TaskModel.findById(taskId);
            
             if(status === Status.Task.DONE){
                 task.status = Status.Task.DONE
             }
             else if(status === Status.Task.IN_PROGRESS){
                 task.status = Status.Task.IN_PROGRESS
             }
             else{
                 task.status = Status.Task.TODO
             }
             
             task.modifiedAt=Date.now()

               await task.save()

               res.status(200).json({
                  message:"Task status updated sucessfully",
                  task
               })

        }else{
            res.status(404).send({
                message:"taskId and statusId not Found"
            })
        }
    } catch (error) {
        console.log(error)
    }
}


const getAllUserTask=async(req,res)=>{
    try {
        const employeeId = req.headers.userId;

        if (!employeeId) {
            return res.status(400).json({
                message: "User ID is required in headers",
            });
        }
        
        let getTasks  = await TaskModel.find({assignedTo:employeeId})
        if(getTasks.length > 0 ){
            res.status(200).json({
                message:"User tasks fetched sucessfully",
                getTasks
            })
        }else{
            res.status(404).json({
                message: "No tasks found for the user"
            });
        }
        
    } catch (error) {
        console.log(error)
    }
}

const getTaskById=async(req,res)=>{
    try {
        let taskId=req.params.id;
        if(taskId){
             let task = await TaskModel.findById(taskId)
             if(task){
                  res.status(200).json({
                     message:"Task fetched sucessfully",
                     task
                  })
             }else{
                res.status(404).json({
                    message: "no tasks found"
                });
             }
        }else{
            res.status(404).json({
                message: "tasks Id not found "
            });
        }
    } catch (error) {
        console.log(error)
    }
}

const deleteTask=async(req,res)=>{
    try {
        let taskId=req.params.id;

         let deletetask= await TaskModel.deleteOne({_id:taskId})
          
         res.status(200).send({
            message:"task deleted sucessfully",
            deletetask
         })
    } catch (error) {
        console.log(error)
    }
}

const getOverallPerformance = async (req, res) => {
    try {
        const employeeId = req.headers.userId; // Get the employee ID from the route parameter

        const employee = await EmployeeModel.findById(employeeId).populate(['timelogs', 'assignedTasks']);
        
        if (!employee) {
            return res.status(404).send({
                message: "Employee not found",
            });
        }

        // Calculate total hours worked
        const totalHoursWorked = employee.timelogs.reduce((total, log) => {
            return total + log.totalHours; // Sum up the totalHours directly
        }, 0);

        // Task counts based on status
        const completedTasks = employee.assignedTasks.filter(task => task.status == Status.Task.DONE).length;
        const pendingTasks = employee.assignedTasks.filter(task => task.status == Status.Task.TODO).length;
        const inProgressTasks = employee.assignedTasks.filter(task => task.status == Status.Task.IN_PROGRESS).length;

        // Return performance data
        res.status(200).send({
            message: "Employee performance data retrieved successfully",
            performance: {
                employee: employee._id,
                name: employee.name,
                email: employee.email,
                totalHoursWorked,
                totalTasks: employee.assignedTasks.length,
                completedTasks,
                pendingTasks,
                inProgressTasks  
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error retrieving employee performance data",
        });
    }
};





export default {
     createTask,
     updateTask,
     updateTaskStatus,
     getAllUserTask,
     getTaskById,
     getOverallPerformance,
     deleteTask

}

