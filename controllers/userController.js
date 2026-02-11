import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from"nodemailer";
import Otp from "../models/otp.js";
import OTP from "../models/otp.js";
dotenv.config();

const transport = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    },
})

export function saveUsers(req, res) {

    if (req.body.role == "admin") {
        if (req.user == null) {
            res.status(403).json({
                message: "please login as admin before creating an admin account",
            });
            return;
        }
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        password: hashedPassword

    })
    user.save().then(() => {
        res.json({ message: "User saved" });
    }).catch(() => {
        res.status(500).json({ message: "Error saving user" });
    });

}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then((user) => {
        if (user == null) {
            return res.status(404).json({ message: "Authentication failed" });
        }
        else {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isDisabled: user.isDisabled,
                    isEmailVerified: user.isEmailVerified
                }

                const token = jwt.sign(userData, process.env.JWT_KEY);

                res.json({
                    message: "Login successful",
                    token: token,
                    user: userData
                });
            }
            else {
                return res.status(401).json({ message: "Authentication failed" });
            }
        }
    }).catch(() => {
        res.status(500).json({ message: "Error logging in" });
    });
}
export async function googleLogin(req,res){
    const accessToken=req.body.accessToken;

    try{
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers:{
                Authorization:"Bearer "+ accessToken
            }
        })
        console.log(response)

        const user= await User.findOne({
            email : response.data.email  //check whether already user in this name
        })
            if(user==null){
                const newUser= new User({
                    email:response.data.email,
                    firstName:response.data.given_name,
                    lastName:response.data.family_name,
                    isEmailVerified:true,
                    password:accessToken
                })
                await newUser.save()
                const userData = {
                    email: response.data.email,
                    firstName: response.data.given_name,
                    lastName: response.data.family_name,
                    role: "user",
                    isEmailVerified: true,
                  
                }

                const token = jwt.sign(userData, process.env.JWT_KEY);

                res.json({
                    message: "Login successful",
                    token: token,
                    user: userData
                });
            }else{
                    const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isDisabled: user.isDisabled,
                    isEmailVerified: user.isEmailVerified
                }

                const token = jwt.sign(userData, process.env.JWT_KEY);

                res.json({
                    message: "Login successful",
                    token: token,
                    user: userData
                });
            }                         
    }catch(e){
        console.log(e)
        res.status(500).json({
            message: "Google Login Failed"
        })
    }

}
export function getCurrentUser(req,res){
    if(req.user == null){
        res.status(403).json({
            message:"Please Login to get user details",
        });
        return;
    }
    res.json({
        message:"User details",
        user:req.user
    })
}
export function sendOTP(req,res){
    const email= req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);

    const message = {
        from:process.env.EMAIL,
        to:email,
        subject:"OTP Verification",
        text:"Your OTP is  : " + otp
    }
    const newOtp=new OTP({
        email:email,
        otp:otp
        
    })
    newOtp.save().then(()=>{
        res.json({
            message:"OTP sent successfully"
        })
    })
    
    transport.sendMail(message,(err,info)=>{
        if(err){
            console.log(err)
            res.status(500).json({
                message:"Failed to send OTP"
            })
        }else{
            console.log(info)
            res.json({
                message:"OTP sent successfully"
            })
        }
    })
    
}

export async function changePassword(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const otp = req.body.otp;
    
    try{
       const lastOTPData= await OTP.findOne({
            email:email,
            otp:otp
        }).sort({createdAt:-1})
        if (lastOTPData==null){
            res.status(404).json({
                message:"No otp found for thius email"
            })
            return;
        }if(lastOTPData.otp!=otp){
            res.status(404).json({
                message:"Invalid OTP"
            })
            return;
        }
        const hashedPassword=bcrypt.hashSync(password,10);
        await User.updateOne({
            email:email
        },{
            password:hashedPassword
        })
        await OTP.deleteOne({
            email:email
        })
        res.json({
            message:"Password changed successfully"
        })  
        const isOTPExpired = (Date.now() - lastOTPData.createdAt) > 10 * 60 * 1000;
        if (isOTPExpired){
            res.status(404).json({
                message:"OTP Expired"
            })
            return;
        }
        const user = await User.findOne({
            email:email
        })
        if (user==null){
            res.status(404).json({
                message:"User not found"
            })
            return;
        }
        user.password = bcrypt.hashSync(password, 10);
        await user.save();
        res.json({
            message:"Password changed successfully"
        })
    }catch(e){
        res.status(500).json({
            message:"Error changing password"
        })
    }
    
}
