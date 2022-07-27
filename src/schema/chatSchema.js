const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
      user: {
        email: String,
        username: String,
      },
      system: {
        username: String,
      },
      date: {
        type: String,
        default: Date.now()
      },
      text: {
        type: String,
        required: true,
        maxlength: 200
      }
    }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;