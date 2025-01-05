import mongoose from './index.js'

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
         type:String,
         required:[true,'email is required'],
         unique:true
    },
    password:{
        type:String,
        min:3
    },
    role:{
        type:String,
        enum:['employee','admin'],
        default:'employee'
    },
    assignedTasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tasks'
        },
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    }
},{
    collection:'Employees',
    versionKey:false
})



employeeSchema.virtual('timelogs',{
    ref:'Timelogs',
    localField:'_id',
    foreignField:'employee'
})


employeeSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.id; // Remove `id`
        return ret;
    },
});

employeeSchema.set('toObject',{virtuals:true})

const EmployeeModel = mongoose.model('Employees',employeeSchema)

export default EmployeeModel