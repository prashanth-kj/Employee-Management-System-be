import Auth from "../common/auth.js";
import EmployeeModel from "../model/employee.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
dotenv.config();

const createEmployee=async(req,res)=>{
    try {
        let employee= await EmployeeModel.findOne({email:req.body.email})

        if(!employee){
            let {name,email,password}=req.body

            if(name && email && password){
               req.body.password= await Auth.hashPassword(req.body.password)

               let newEmployee= await EmployeeModel.create(req.body)

                res.status(201).json({
                    message:"new Employee created sucessfully",
                    newEmployee
                })

            }else{
                res.status(404).json({
                    message:"All data field is required"
                })
            }
        }else{
            res.status(404).json({
                message:`user with ${req.body.email} is already exists`
            })
        }
       
    } catch (error) {
        console.log(error)
    }
}

const login=async(req,res)=>{
     try {
        let employee= await EmployeeModel.findOne({email:req.body.email})
        if(employee){
            let hashCompare =await Auth.hashCompare(req.body.password,employee.password)

            if(hashCompare){
                 let token = await Auth.createToken({
                    id:employee._id,
                    name:employee.name,
                    email:employee.email,
                    role:employee.role
                 })
                 employee= await EmployeeModel.findOne({email:employee.email},{_id:0,name:1,role:1})
                 res.status(201).json({
                    message:"Login sucessfull",
                    token,
                    employee
                 })
            }else{
                res.status(404).json({
                    message:"password does not match"
                })
            }
        }else{
            res.status(404).json({
                message:`Account with ${req.body.email} does not exists`
            })
        }
     } catch (error) {
        console.log(error)
     }
}

const getprofile =async(req,res)=>{
     try {
        let getemployee= await EmployeeModel.findById({_id:req.headers.userId},{_id:0,name:1,email:1,role:1})
        
        res.status(200).json({
            message:"employee fetched sucessfully",
            getemployee
        })
     } catch (error) {
        console.log(error)
     }
}

const updateprofile=async(req,res)=>{
    try {
        let getemployee= await EmployeeModel.findOne({_id:req.headers.userId})
          if(getemployee){
               let {name,email}=req.body;
               if(name && email){

                    getemployee.name=name
                    getemployee.email=email

                    await getemployee.save()

                    res.status(200).json({
                        message:"profile updated sucessfully",
                    })
               }
          }else{
            res.status(400).send({
                message:"employee not found"
            })
          }
    } catch (error) {
        console.log(error)
    }
}



const forgetPassword= async(req,res)=>{
    try {
         
          let user = await EmployeeModel.findOne({email:req.body.email});

            if(user){
                   // Set the expiration time to 2 minutes from now (you can adjust this as needed)
                   const expirationTime = Math.floor(Date.now() / 1000) + 2 * 60;
                   
                   const token = jwt.sign(
                    {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    exp: expirationTime,
                    },
                    process.env.JWT_SECRET
                 );
                 
                  const resetLink = `${process.env.FE_URL}/resetpassword?token=${token}`

                  // send email using nodemailer
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        user: process.env.EMAIL_ID,
                        pass: process.env.EMAIL_PASS,
                        },
                    });


                    const mailOptions = {
                        from: process.env.EMAIL_ID,
                        to: user.email,
                        subject: 'Password Reset Link',
                        text: `Click the following link to reset your password\n ${resetLink}`,
                   };

                   transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                         console.log(error);
                         res.status(500).send({
                              message: 'Failed to send the password reset mail',
                         });
                    } else {
                         console.log(info.response);
                         res.status(200).send({
                              message: 'Password reset mail sent successfully',
                              resetLink,
                         });
                    }
               });

            }else{
                  res.status(400).send({
                      message: `Account with ${req.body.email} does not exist`
                  })
            }
        
        } catch (error) {
            console.log(error);
            res.status(500).send({
            message:"Internal servar error",
            error:error.message
            })
        }
}

const resetPassword=async(req,res)=>{
try {
      
      let token =req.headers.authorization?.split(" ")[1];
     
      if(token){
         let data= await Auth.decodeToken(token);

          // Check if the token has expired
          if (data.exp < Date.now() / 1000) {
               return res.status(400).send({
               message: 'Reset link has expired. Please request a new one.',
               });
          }

           if(req.body.newpassword===req.body.confirmpassword){

                let user= await EmployeeModel.findOne({email:data.email});
                  user.password=await Auth.hashPassword(req.body.newpassword)

                  await user.save();

                  res.status(201).send({
                      message:"Password updated sucessfully"
                  })

           }else{
              res.status(400).send({
                  message:"Password does not match"
              })
           }
    }
    else{
      res.status(400).send({
          message:"Token not found"
      })
    }


} catch (error) {
   console.log(error);
}
}




export default{
  createEmployee,
  login,
  getprofile,
  updateprofile,
  forgetPassword,
  resetPassword
}


