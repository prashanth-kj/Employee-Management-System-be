import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const hashPassword=async(password)=>{
      
       let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))

       let hash = await bcrypt.hash(password,salt)
       return hash
}

const hashCompare=async(password,hash)=>{
    return await bcrypt.compare(password,hash)
}

let createToken=async(payload)=>{

      let token = await jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
      })

      return token
}

let decodeToken = async(token)=>{
      let payload= jwt.decode(token)
      return payload
}

let validate=async(req,res,next)=>{
   
    let token = await req.headers.authorization?.split(' ')[1]

    if(token){
         let payload = await decodeToken(token)
              req.headers.userId=payload.id
          
          let currentTime = (+new Date()/1000);

            if(currentTime < payload.exp){
                next()
            }else{
                res.status(401).json({
                    message:"Token Expired"
                })
            }

    }else{
         res.status(401).send({
            message:'Token not found'
         })
    }

}


const adminGuard= async(req,res,next)=>{
         
    let token = await req.headers.authorization?.split(" ")[1];
      if(token){
               
            let payload =await decodeToken(token);
            
               if(payload.role==="admin"){
                   next();
               }else{
                    res.status(401).send({
                      message:"only Admins are allowed"
                    })
               }
           
              
      }else{
           res.status(401).send({
                message:"No Token Found"
           })
      }
}


export default{
    hashPassword,
    hashCompare,
    createToken,
    decodeToken,
    validate,
    adminGuard
}