import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

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
                return res.json({ message: "Authentication failed" });
            }
        }
    }).catch(() => {
        res.json({ message: "Error logging in" });
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

