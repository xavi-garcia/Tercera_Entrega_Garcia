//import models
const orderSchema = require("../schema/orderSchema");
const userSchema = require("../schema/userSchema");
const productsSchema = require("../schema/productsSchema");

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();



module.exports = {

    index: (req, res) => {
        const { name, username } = req.user
        res.render("admin/index", { name: `${name} ${username}` })
    },

    getUsers:  async (req, res) => {
        const users = await userSchema.find().lean()
        res.render("admin/users", { users })
    },
    
    getProducts: async (req, res) => {
        const products = await productsSchema.find().lean()
        res.render("admin/products", { products: products } )
    },

    getById: async (req, res) =>{
        const { id } = req.params;
        const product = await productsSchema.findOne({_id: id}).lean();
        res.render("admin/updateProduct", {product: product})
    },

    getOrders: async (req, res) => {
        const orders = await orderSchema.find().lean()
        res.render("admin/orders", { orders } )
    }
}