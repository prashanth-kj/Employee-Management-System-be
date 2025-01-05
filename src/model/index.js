import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

try {
    mongoose.connect(`${process.env.db_Url}/${process.env.db_Name}`)
} catch (error) {
    console.log(error)
}


export default mongoose