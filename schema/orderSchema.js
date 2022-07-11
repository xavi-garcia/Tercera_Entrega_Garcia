const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
    {
        userId: String,
        total: { 
            type: Number, 
            default: 0 
        },
        created: { 
            type: Date,  
            default: Date.now 
        },
        send: {
            type: Boolean,
            default: false
        }
    }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;