const mongoose = require("mongoose");


const OrderSchema = mongoose.Schema(
    {
        userId: String,
        email: String,
        products: [],
        sendAddress: String,
        created: { 
            type: Date,  
            default: Date.now 
        },
        sent: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: Number,
            default: 1
        }
    }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;