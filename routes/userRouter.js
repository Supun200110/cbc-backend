import express from 'express';
import { getCurrentUser, googleLogin, loginUser, saveUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/',saveUsers)
userRouter.post('/login', loginUser)
userRouter.post("/google",googleLogin)
userRouter.get("/current",getCurrentUser)

export default userRouter;