const cartModel = require("../models/Cart");
const prodModel = require("../models/Products");

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./logger');
const logger = log4js.getLogger();

exports.getAll = async (req, res) => {
    let products = [];
    products = await cartModel.find(find);
    
    if (products.length == 0) {
        logger.info("Empty Cart");
    } else {
        logger.info("Carts: " + products.length);
    }
    res.status(200).send(products);
},

exports.getCartById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.sendStatus(404)
    }

    try {
        const cart = await cartModel.findById({ _id: id });
        logger.info("CarritoId: " + id);
        res.status(200).send(cart);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},

exports.getCartByUser = async (req, res) => {
    const id = req.user;
    if (!id) {
        return res.sendStatus(404)
    }

    try {
        const cart = await cartModel.findOne({ user: id });
        res.status(200).send(cart);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},

exports.UploadCart = async (req, res) => {
    const { id, idprod } = req.params;
    
    try {
        const cart = await cartModel.findById({ _id: id });
        const idpd = await prodModel.findById({ _id: idprod });
        cart.products.push(idpd);
        await cart.save();
        logger.info("Product added succesfully");
        res.status(201).send(cart);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},


exports.deleteCart = async (req, res) => {
    const { id } = req.params;
    try {
        await cartModel.deleteOne({_id: id});
        logger.info("Cart successfully deleted");
        res.status(200).send("Cart deleted");
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},

exports.deleteProd = async (req, res) => {
    const { id, product } = req.params;
    
    try {
        const cart = await cartModel.findById({_id: id});
        cart.products = cart.products.filter(i => i._id != product);
        await cart.save();
        logger.info("Product successfully deleted");
        res.status(200).send(cart);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},


exports.deleteAll = async (req, res) => {
    try {
        await cartModel.deleteMany({});
        logger.info("All carts were deleted");
        res.status(200).send("No carts to display");
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
}
