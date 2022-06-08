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
            default:"https://w7.pngwing.com/pngs/86/512/png-transparent-levi-mikasa-ackerman-eren-yeager-attack-on-titan-weekly-sh%C5%8Dnen-magazine-anime-face-black-hair-manga.png",
        },
    }
)

const User = mongoose.model("Users", userSchema);

module.exports = User;