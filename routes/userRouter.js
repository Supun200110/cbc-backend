import express from 'express';
import { changePassword, getCurrentUser, googleLogin, loginUser, saveUsers, sendOTP } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/',saveUsers)
userRouter.post('/login', loginUser)
userRouter.post("/google",googleLogin)
userRouter.get("/current",getCurrentUser)
userRouter.post("/sendMail",sendOTP)
userRouter.post("/changePwd",changePassword)

export default userRouter;