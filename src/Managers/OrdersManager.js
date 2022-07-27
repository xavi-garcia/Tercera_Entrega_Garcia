const orderSchema = require("../schema/orderSchema");
const cartSchema = require("../schema/cartSchema");
const userSchema = require("../schema/userSchema");

// twilio
const twilioSender = require('../config/notificationServices/twilio');
const mailSender = require('../config/notificationServices/mailSender')

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();


exports.getAllOrders = async (req, res) => {
    try {
        const data = await orderSchema.find().lean();
        logger.info("Orders: " + data.length);
        res.status(200).send(data) 
    } catch (error) {
        logger.error(error);
        res.status(500).send(error)
    }

};


exports.createOrder = async (req, res) => {
    const {cartId, userID} = req.params;

    try {
        const orderExists = await orderSchema.findOne();
        if(orderExists) {
            const cart = await cartSchema.findById({ _id : cartId}).lean();
            const user = await userSchema.findById({ _id : userID}).lean();
            const cartProducts = cart.products;
            const cartAddress = cart.address;
            const userEmail = user.email;
            const orderID = orderExists.orderId +1;
            const sentOrder = true
            const template = `<h1 style="color: yellow;"> Your order is being processed </h1>
                            <p>These are your products: </p>
                            <ul>${cartProducts}</ul>`
            const order = await orderSchema.create({
                userId : userID, 
                email : userEmail, 
                products : cartProducts, 
                sendAddress : cartAddress, 
                sent : sentOrder, 
                orderId : orderID } );
            await mailSender.send(template, userEmail, user.name)
            logger.info("Order:\n" + order);
            res.status(201).send(order);
        } else {
        const cart = await cartSchema.findById({ _id : cartId}).lean();
        const user = await userSchema.findById({ _id : userID}).lean();
        const cartProducts = cart.products;
        const cartAddress = cart.address;
        const userEmail = user.email;
        const orderID =  +1;
        const sentOrder = true
        const template = `<h1 style="color: yellow;"> Your order is being processed </h1>
                          <p>These are your products: </p>
                          <ul>${cartProducts}</ul>`
        const order = await orderSchema.create({
            userId : userID, 
            email : userEmail, 
            products : cartProducts, 
            sendAddress : cartAddress, 
            sent : sentOrder, 
            orderId : orderID });
        await mailSender.send(template, userEmail, user.name)
         logger.info("Order:\n" + order);
         res.status(201).send(order);
        }
    } catch (error) {
        logger.error(error);
        res.status(500).send(error)
    }

};

exports.deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        await orderSchema.deleteOne({ _id: id });
        res.status(200).send("Order deleted");
    } catch (err){
        logger.error("Id not found" + err)
        res.status(500).send(err);
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await orderSchema.deleteMany();
        logger.info("Order deleted from cart");
        res.status(200).send("All orders were deleted")
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
    
};


exports.getByUserId = async (req, res) => {
    const userId = req.user;
    try {
        const order =  await orderSchema.findOne({ userId: userId._id }).lean()
        if (!order) {
        return logger.error('The user has not placed an order yet')
    } logger.info("Order by user: " + order.userId)
        res.status(200).send(order)
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
    
   
}


exports.updateSendOrder = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const { username, email } = req.user;
    if (!id) {
        return res.sendStatus(404)
    }
    try {
        const order = await orderSchema.findByIdAndUpdate({_id: id}, {$set : body});
        order.send = true;
        await order.save();
        await twilioSender.sendMessage(username, email)
        res.status(202).send(body)
    } catch (err) {
        logger.error(err);
        res.status(500).send(err)
    }
}