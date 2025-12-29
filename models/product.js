import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

        productId: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        altName: {type: [String], default: []},
        price: {type: Number, required: true},
        labeledPrice: {type: Number, required: true},
        description: {type: String, required: true},
        images: {type: [String],required:true, default: ["https://th.bing.com/th/id/OIP.HliqwcOHQoXZtT5TViCgMwHaFj?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"]}, 
        stock: {type: Number, required: true, default: 0},

});
const Product = mongoose.model("Product", productSchema);
export default Product;