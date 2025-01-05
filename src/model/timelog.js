import mongoose from './index.js'

const timelogSchema= new mongoose.Schema({
     employee:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Employees'
     },
     startTime:{
        type:Date,
     },
     endTime: { type:Date },
     totalHours: { type: Number, default: 0 },
     status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      remarks:{
          comment: { type: String},
          addedBy: { type: String, enum: ['employee', 'admin']},
          timestamp: { type: Date, default: Date.now() },
      },

      createdAt: { type: Date, default: Date.now() },
      modifiedAt: {type:Date}
},{
    collection:'Timelogs',
    versionKey:false
})

timelogSchema.pre('save', function (next) {
    if (this.startTime && this.endTime) {
        const timeDiff = this.endTime - this.startTime; // Time difference in milliseconds
        this.totalHours = parseFloat((timeDiff / (1000 * 60 * 60)).toFixed(2)); // Convert to hours with 2 decimal places
    }
    next();
});


const TimelogModel= mongoose.model('Timelogs',timelogSchema)

export default TimelogModel

