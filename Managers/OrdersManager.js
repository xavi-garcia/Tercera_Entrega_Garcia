const orderModel = require("../models/Order");
const userModel = require("../models/User");

// twilio
// const twilioSender = require('../notifications/twilio')

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../logger');
const logger = log4js.getLogger();


exports.getAll = async (req, res) => {
    const data = await orderModel.find().lean();
    logger.info("Orders: " + data.length);
    res.status(200).send(data)
};


exports.save = async (req, res) => {
    const order = await orderModel.create();
    logger.info("Order:\n" + order,)
    res.status(201).send(order)
}


exports.deleteAllOrders = async (req, res) => {
    await orderModel.deleteMany();
    logger.info("Order deleted from cart");
    res.status(200).redirect("/")
}


exports.getByUser = async (req, res) => {
    const userId = req.user;
    const order =  await orderModel.findOne({ userId: userId._id }).lean()
    if (!order) {
        return {}
    }
    logger.info("Order by user: " + order.userId)
    res.status(200).send(order)
}


// update sent order
// exports.updateSendOrder = async (req, res) => {
//     const {id} = req.params;
//     const { firstName, email } = req.user;
//     if (!id) {
//         return res.sendStatus(404)
//     }
//     try {
//         const order = await orderModel.findById({_id: id})
//         order.send = true;
//         await order.save();
//         twilioSender.sendSms(firstName, email)
//         res.sendStatus(202)
//     } catch (err) {
//     logger.error(err);
//     res.status(500).send(err)
//     }
// }