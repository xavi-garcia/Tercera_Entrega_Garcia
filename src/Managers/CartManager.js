const cartSchema = require("../schema/cartSchema");
const productSchema = require("../schema/productsSchema");
const userSchema = require('../schema/userSchema');

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();

exports.createCart = async (req, res) =>{
    const userId = req.params;
    try {
        const hasCart = cartSchema.findOne({user: userId});
        if(hasCart) {
            logger.error("this user has a cart already");
            return {status: "error", message: "this user has a cart already"};
        }
        const userAddress = userSchema.findOne({user: userId});
        const actualAddress = userAddress.address;
        const cart = await cartSchema.create({products: [], user: userId, address: actualAddress });
        return {status: "success", payload: cart};
    } catch(error) {
        logger.error("the cart couldn't be created");
        return {status: "error", message: "the cart couldn't be created"};
    }

}

exports.getAll = async (req, res) => {
    let products = [];
    products = await cartSchema.find();
    
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
        const cart = await cartSchema.findById({ _id: id });
        logger.info("CartId: " + id);
        res.status(200).send(cart);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},

exports.getCartByUser = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.sendStatus(404)
    }

    try {
        const cart = await cartSchema.findOne({ user: id });
        res.status(200).send(cart);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},


exports.updateCartById = async (req, res) => {
    const {id, prodId} = req.params;
    const {body} = req;
    
    try {
        const cart = await cartSchema.findById({ _id: id });
        let idpd = await productSchema.findById({ _id: prodId }); 
        const update = await cartSchema.updateOne({_id: id,}, {$set: body, });
        logger.info("Cart succesfully updated");
        res.status(201).send(body);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},

exports.addProductById = async (req, res) => {
    const { id, idprod } = req.params;
    let products = [];
    products = await cartSchema.find()
    
    try {
        const cart = await cartSchema.findById({ _id: id });
        const idpd = await productSchema.findById({ _id: idprod });
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
        await cartSchema.deleteOne({_id: id});
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
        const cart = await cartSchema.findById({_id: id});
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
        await cartSchema.deleteMany({});
        logger.info("All carts were deleted");
        res.status(200).send("No carts to display");
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
}
