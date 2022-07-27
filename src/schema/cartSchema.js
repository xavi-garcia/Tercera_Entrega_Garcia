const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        products: [],
        timestamp: {
            type: Number,
            default: Date.now()
        },
        user: {
            type: String,
            required:true,
        },
        address: {
            type: String,
        },
        total: {
            type: Number,
            default: 0,
        }
    }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
