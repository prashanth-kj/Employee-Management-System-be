import EmployeeModel from "../model/employee.js";
import TaskModel from "../model/task.js";
import TimelogModel from "../model/timelog.js";
import { Status } from "../common/utils.js";

const createEmployee = async (req, res) => {
  try {
    let { name, email } = req.body;

    let employee = await EmployeeModel.findOne({ email: req.body.email });
    if (!employee) {
      if (name && email) {
        let newEmployee = new EmployeeModel({
          name: name,
          email: email,
        });

        await newEmployee.save();

        res.status(201).send({
          message: "New employee created sucessfully",
          newEmployee,
        });
      } else {
        res.status(400).json({
          message: "All Field is required",
        });
      }
    } else {
      res.status(400).json({ message: "Employee already exists" });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateEmployee = async (req, res) => {
  try {
    let employeeId = req.params.id;

    if (employeeId) {
      let employee = await EmployeeModel.findById(employeeId);

      if (employee) {
        let { name, email } = req.body;

        if (name && email) {
          employee.name = name;
          employee.email = email;

          await employee.save();

          res.status(200).send({
            message: "Employee updated sucessfully",
          });
        } else {
          res.status(400).json({
            message: "All Field is required",
          });
        }
      } else {
        res.status(400).json({
          message: "Employee  not found",
        });
      }
    } else {
      res.status(400).json({
        message: "Employee Id not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    let employeeId = req.params.id;

    if (employeeId) {
      let deleteEmployee = await EmployeeModel.deleteOne({ _id: employeeId });
      res.status(200).json({
        message: "employee deleted sucessfully",
        deleteEmployee,
      });
    } else {
      res.status(400).json({
        message: "Employee Id not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const createTask = async (req, res) => {
  try {
    let { title, description, project, deadline } = req.body;

    if (title && description && project && deadline) {
      let newTask = new TaskModel({
        title: title,
        description: description,
        project: project,
        deadline: deadline,
        createdBy: req.headers.userId,
      });
      await newTask.save();

      res.status(201).json({
        message: "new task created sucessfully",
        newTask,
      });
    } else {
      res.status(400).json({
        message: "All data field is required",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async (req, res) => {
  try {
    let taskId = req.params.id;
    if (taskId) {
      let task = await TaskModel.findById(taskId);

      if (task) {
        let { title, description, project, deadline } = req.body;

        (task.title = title),
          (task.description = description),
          (task.project = project),
          (task.deadline = deadline);
        task.modifiedBy = req.headers.userId;
        task.modifiedAt = Date.now();

        await task.save();

        res.status(200).json({
          message: "task updated sucessfully",
          task,
        });
      } else {
        res.status(400).json({
          message: "Task not found",
        });
      }
    } else {
      res.status(400).json({
        message: "Task id not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (req, res) => {
  try {
    let taskId = req.params.id;

    let deletetask = await TaskModel.deleteOne({ _id: taskId });

    res.status(200).send({
      message: "task deleted sucessfully",
      deletetask,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllEmployees = async (req, res) => {
  try {
    let employees = await EmployeeModel.find(
      { role: "employee" },
      { password: 0 }
    );
    res.status(200).json({
      message: "All employees fetched sucessfully",
      employees,
    });
  } catch (error) {
    console.log(error);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    let employeeId = req.params.id;
    let employee = await EmployeeModel.findById(employeeId).populate(
      "assignedTasks"
    );
    res.status(200).json({
      message: "Employee data fetched sucessfully",
      employee,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllTasks = async (req, res) => {
  try {
    let tasks = await TaskModel.find().populate("assignedTo", "name");
    res.status(200).json({
      message: "All tasks fetched sucessfully",
      tasks,
    });
  } catch (error) {
    console.log(error);
  }
};

const getEmployeeTasks = async (req, res) => {
  try {
    let employeeId = req.params.id;

    let tasks = await TaskModel.find({ assignedTo: employeeId });

    if (tasks) {
      res.status(200).json({
        message: "Assigned tasks retrieved successfully",
        tasks,
      });
    }

  } catch (error) {
    console.log(error);
  }
};

const getEmployeePerformance = async (req, res) => {
  try {
    const employees = await EmployeeModel.find({role:"employee"}).populate([
      "timelogs",
      "assignedTasks",
    ]);

    const employeePerformance = employees.map((employee) => {
      const totalHoursWorked = employee.timelogs.reduce((total, log) => {
        const hours =
          (new Date(log.endTime) - new Date(log.startTime)) / (1000 * 60 * 60);
        return total + hours;
      }, 0).toFixed(2);

      let completedTasks = employee.assignedTasks.filter(
        (task) => task.status == Status.Task.DONE
      );
      let pendingTasks = employee.assignedTasks.filter(
        (task) => task.status == Status.Task.TODO
      );
      let inProgressTasks = employee.assignedTasks.filter(
        (task) => task.status == Status.Task.IN_PROGRESS
      );

      return {
        employee: employee._id,
        name: employee.name,
        email: employee.email,
        totalHoursWorked,
        totalTasks: employee.assignedTasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        inProgressTasks: inProgressTasks.length,
      };
    });

    res.status(200).send({
      message: "Employee performance data retrieved successfully",
      employeePerformance,
    });
  } catch (error) {
    console.log(error);
  }
};


const getTaskById = async (req, res) => {
  try {
    let taskId = req.params.id;
    let task = await TaskModel.findById(taskId).populate("assignedTo");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "task by id fetched secessfully",
      task,
    });
  } catch (error) {
    console.log(error);
  }
};

const assignTaskToEmployee = async (req, res) => {
  try {
    let taskId = req.params.id;
    let { selectedEmployee } = req.body;

    const task = await TaskModel.findById(taskId).populate('assignedTo','name');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const employee = await EmployeeModel.findById(selectedEmployee);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (task.assignedTo) {
      return res.status(400).json({
          message: `Task is already assigned to ${task.assignedTo.name}.`,
      });
  }
    
    task.assignedTo = selectedEmployee;
    await task.save();

    if (!employee.assignedTasks.includes(taskId)) {
      employee.assignedTasks.push(taskId);
      await employee.save();
    } else {
      return res.status(400).send({
        message: "task already assigned",
      });
    }

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (error) {
    console.log(error);
  }
};

const generateWorkReport = async (req, res) => {
  try {
    let { startDate, endDate } = req.body;
    let employeeId = req.params.id;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const timelogs = await TimelogModel.find({
      employee: employeeId,
      startTime: { $gte: start },
      endTime: { $lte: end },
    }).populate('employee');

    const totalHours = timelogs
      .reduce((total, log) => {
        const hours =
          (new Date(log.endTime) - new Date(log.startTime)) / (1000 * 60 * 60);
        return total + hours;
      }, 0)
      .toFixed(2);
      
      const employee = timelogs[0].employee;

    res.status(201).send({
      message: "Report generated sucessfully",
      name:employee.name,
      email:employee.email,
      totalHours,
    });
  } catch (error) {
    console.log(error);
  }
};



const getTimelogById = async (req, res) => {
  try {
    let employeeId = req.params.id;

    if (employeeId) {
      let timelog = await EmployeeModel.findById(employeeId).populate('timelogs assignedTasks')

      if (!timelog) {
        return res.status(404).json({ message: "Timelog not found" });
      }
       

 
      res.status(200).json({
        message: "Timelog retrieved successfully",
        timelog

      });
    } else {
      res.status(400).json({
        message: "timelogId not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateTimelogStatus = async (req, res) => {
  try {
    let timelogId = req.params.id;
    let status = req.params.status;
    let { comment } = req.body;

    if (timelogId && status) {
      let timelog = await TimelogModel.findById(timelogId);

      if (status == Status.Timelog.APPROVED) {
        timelog.status = Status.Timelog.APPROVED;
      } else if (status == Status.Timelog.REJECTED) {
        timelog.status = Status.Timelog.REJECTED;
      } else {
        timelog.status = Status.Timelog.PENDING;
      }

      timelog.remarks.comment = comment;
      timelog.remarks.addedBy = "admin";
      timelog.modifiedAt = Date.now();

      await timelog.save();

      res.status(200).json({
        message: `timelog ${status} sucessfully`,
      });
    } else {
      res.status(400).json({
        message: "TaskId and Status not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  createTask,
  updateTask,
  deleteTask,
  getAllEmployees,
  getEmployeeById,
  getAllTasks,
  getTaskById,
  assignTaskToEmployee,
  getEmployeeTasks,
  getTimelogById,
  updateTimelogStatus,
  getEmployeePerformance,
  generateWorkReport,

};
