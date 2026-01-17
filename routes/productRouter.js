import express from 'express';
import { createProduct, deleteProduct, getProduct, getProductById, updateProduct} from '../controllers/productController.js';
import { get } from 'mongoose';

const productRouter = express.Router();

productRouter.post("/", createProduct)
productRouter.get("/", getProduct)
productRouter.get("/:id",getProductById)
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)

export default productRouter;