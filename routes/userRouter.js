import express from 'express';
import { googleLogin, loginUser, saveUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/',saveUsers)
userRouter.post('/login', loginUser)
userRouter.post("/google",googleLogin)

export default userRouter;