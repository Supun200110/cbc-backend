import express from 'express';  
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken' ;
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';  
const app = express();


//mongodb+srv://admin:123@cluster0.ftlxeqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect("mongodb+srv://admin:123@cluster0.ftlxeqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(
    () => {
        console.log("Connection failed");
    }   
)


app.use(bodyParser.json());
app.use(verifyJWT)


app.use("/api/user", userRouter);
app.use("/api/user/login", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});