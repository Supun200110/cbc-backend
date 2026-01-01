import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(cors()) //anyone can send request to this backend

//mongodb+srv://admin:123@cluster0.ftlxeqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(process.env.MONGO_URL)
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
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});