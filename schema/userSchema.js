const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true
        },
        username:{
            type: String, 
            required: true
        },
        password:{
            type:String, 
            required: true
        },
        confirmPassword:{
            type:String, 
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
    }
)

const User = mongoose.model("Users", userSchema);

module.exports = User;