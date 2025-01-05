import TimelogModel from "../model/timelog.js";


const clockIn= async(req,res)=>{
  try {
     let employeeId= req.headers.userId
     
      const activeSession = await TimelogModel.findOne({employee:employeeId, isActive:true})

      if(activeSession){
         return res.status(400).send({ message: "You are already clocked in." });
      }

      const newTimeLog = new TimelogModel({
          employee:employeeId,
          startTime:new Date(),
          isActive:true
      })
      
      await newTimeLog.save();

      res.status(201).json({
         message:"Work Mode On!..",
         timelog:newTimeLog
      })

  } catch (error) {
    console.log(error)

  }
}


const clockOut= async(req,res)=>{
    try {
        let employeeId= req.headers.userId;

        let activeSession = await TimelogModel.findOne({employee:employeeId, isActive:true})

         if(!activeSession){
            return res.status(404).send({ message: "No active session found." });
         }

         activeSession.endTime=new Date()
         activeSession.isActive=false
        await activeSession.save();

        res.status(201).send({
            message: "Work Mode Off!..",
            timelog: activeSession,
        });

    } catch (error) {
        console.log(error)
    }
}


const getTimelogs=async(req,res)=>{
  try {
    let employeeId= req.headers.userId
    
     let timeLogs= await TimelogModel.find({employee:employeeId}).sort({createdAt:-1})
       
     res.status(200).send({
        message: "All time logs retrieved successfully.",
        timeLogs
        
    });
  } catch (error) {
    console.log(error)
  }
}

const totalWorkhourPerDay = async (req, res) => {
  try {
     
      const employeeId = req.headers.userId;

       // Get the current date to compare with time logs
      const currentDate = new Date();
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of today
      const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // End of today

      const timelogs = await TimelogModel.find({
          employee: employeeId,
          startTime: { $gte: startOfDay },
          endTime: { $lte: endOfDay },
      });

    

      const totalHours = timelogs.reduce((sum, log) => {
          const hours = (new Date(log.endTime) - new Date(log.startTime)) / (1000 * 60 * 60);
          return sum + hours;
      }, 0).toFixed(2);

      res.status(200).json({
          message: "Total works per day in hours",
          totalHours,
          timelogs,
      });
  } catch (error) {
      console.log(error);
  }
};

const getEmployeeWorkHoursByDate = async (req, res) => {
  try {
    const employeeId = req.headers.userId;

    // Fetch time logs for the employee
    const timelogs = await TimelogModel.find({ employee: employeeId });

    // Group work hours by date
    const workHoursByDate = timelogs.reduce((acc, log) => {
      const date = new Date(log.startTime).toISOString().split("T")[0]; // Extract date
      const hours = (new Date(log.endTime) - new Date(log.startTime)) / (1000 * 60 * 60);

      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += hours;

      return acc;
    }, {});

    // Format the response
    const result = Object.keys(workHoursByDate).map((date) => ({
      date,
      totalHours: workHoursByDate[date].toFixed(2),
    }));

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching work hours:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};


const generateWorkReport=async(req,res)=>{
  try {
    
       let {startDate, endDate}=req.body;
       let employeeId= req.headers.userId;

       const start= new Date(startDate)
       start.setHours(0,0,0,0)
       const end= new Date(endDate)
       end.setHours(23,59,59,999)

       const timelogs = await TimelogModel.find({
           employee:employeeId,
           startTime: {$gte: start},
           endTime:{$lte: end}
       }).populate('employee','name email')

       const totalHours = timelogs.reduce((total,log)=>{
          const hours = (new Date(log.endTime) - new Date(log.startTime)) /(1000 * 60 *60)
          return total + hours
       },0).toFixed(2)
        
       const employee = timelogs[0].employee;

       res.status(201).send({
         message:"Report generated sucessfully",
         name:employee.name,
         email:employee.email,
         totalHours
       
         
       })
  } catch (error) {
    console.log(error)
  }
}


export default{
    clockIn,
    clockOut,
    getTimelogs,
    totalWorkhourPerDay,
    getEmployeeWorkHoursByDate,
    generateWorkReport
}