const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
require('dotenv').config({path:'./config/env/.env'})

module.exports = {
  generateToken: (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
  },
  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET )
  }
}