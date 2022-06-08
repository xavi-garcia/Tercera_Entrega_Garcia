//import models
const orderModel = require("../models/Order");
const userModel = require("../models/User");
const productsModel = require("../models/Products");

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./logger');
const logger = log4js.getLogger();



module.exports = {

    index: (req, res) => {
        const { name, username } = req.user
        res.render("admin/index", { name: `${name} ${username}` })
    },

    getUsers:  async (req, res) => {
        const users = await userModel.find().lean()
        res.render("admin/users", { users })
    },
    
    getProducts: async (req, res) => {
        const products = await productsModel.find().lean()
        res.render("admin/products", { products: products } )
    },

    getOrders: async (req, res) => {
        const orders = await orderModel.find().lean()
        res.render("admin/orders", { orders } )
      }
}