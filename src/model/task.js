import mongoose from './index.js'

const taskSchema = new mongoose.Schema({
 
    title:{ 
        type: String,
        required: [true,'title is required'] 
    },
    description:{
        type: String, 
        required: [true,'description is required'] 
    },
    project: { type: String , required:[true, 'project name is required']},
    deadline: {
        type: Date, 
        required: [true,'deadline is required'] 
     },
    status: {
        type: String,
        default: 'To-Do'
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees'
    },
    createdBy:{type:String},
    modifiedBy:{type:String},
    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date}
},{
    collection:'Tasks',
    versionKey:false
});

const TaskModel = mongoose.model('Tasks',taskSchema);
export default TaskModel;
