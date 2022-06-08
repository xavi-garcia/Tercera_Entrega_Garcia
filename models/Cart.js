const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        timestamp: {
            type: Number,
            default: Date.now()
        },
        products: [],
        user: {
            type: String
        },
        total: {
            type: Number,
            default: 0,
        }
    }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
