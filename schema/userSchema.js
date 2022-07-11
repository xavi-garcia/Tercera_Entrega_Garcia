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
        // confirmPassword:{
        //     type:String, 
        //     required: true
        // },
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
            default:"https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
        },
    }
)

const User = mongoose.model("Users", userSchema);

module.exports = User;