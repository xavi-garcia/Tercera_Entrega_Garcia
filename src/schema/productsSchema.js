const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
        },
        description: { 
            type: String, 
            required:true, 
        },
        price: { 
            type: Number, 
            required:true,
        },
        stock: { 
            type: Number, 
            required:true, 
        },
        code: { 
            type: String, 
            required:true, 
        },
        category: {
            type: String,
            required: true,
        },
        thumbnail: { 
            type: String, 
            required:true, 
        },
        timestamp: { 
            type: Number, 
            default: Date.now() 
        },
        quantity:{
            type:Number,
            default: 0
        }
    }
);

const Products = mongoose.model("products", ProductsSchema);

module.exports = Products;