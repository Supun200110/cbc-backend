import Product from "../models/product.js";


export async function createProduct(req, res) {
    if(req.user==null){
      res.status(404).json({message: "You are not logged in"})
      return;
    }

    if (req.user.role != "admin") {
        res.status(403).json({ message: "You are not authorized to create a product" })
        return;
    }

    const product = new Product(req.body);
    console.log(req.body);
    try{
        await product.save()
        res.json({message: "Product created successfully"})
    }catch(err){
        res.status(500).json({message: "Creating product failed"})
    }

}

export function getProduct(req, res) {
    Product.find().then((product) => {
        res.json(product)
    }).catch(() => {
        res.status(500).json({ message: "Fetching products failed" })
    });
}

export function deleteProduct(req, res) {
    if(req.user==null){
        res.status(404).json({message: "You are not logged in"})
        return;
      }
    Product.findOneAndDelete({productId: req.params.productId}).then(() => {
        res.json({message: "Product deleted successfully"});
    }).catch(() => {
        res.status(500).json({message: "Deleting product failed"});
    });
}

export function updateProduct(req, res) {
    if(req.user==null){
        res.status(404).json({message: "You are not logged in"})
        return;
      }
    Product.findOneAndUpdate({productId: req.params.productId}, req.body).then(() => {
        res.json({message: "Product updated successfully"})
    }).catch(() => {
        res.status(500).json({message: "Updating product failed"})
    })
}