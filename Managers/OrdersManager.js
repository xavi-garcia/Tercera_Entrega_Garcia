const orderSchema = require("../schema/orderSchema");
const userSchema = require("../schema/userSchema");

// twilio
// const twilioSender = require('../notifications/twilio')

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();


exports.getAll = async (req, res) => {
    const data = await orderSchema.find().lean();
    logger.info("Orders: " + data.length);
    res.status(200).send(data)
};


exports.save = async (req, res) => {
    const order = await orderSchema.create();
    logger.info("Order:\n" + order,)
    res.status(201).send(order)
}


exports.deleteAllOrders = async (req, res) => {
    await orderSchema.deleteMany();
    logger.info("Order deleted from cart");
    res.status(200).redirect("/")
}


exports.getByUser = async (req, res) => {
    const userId = req.user;
    const order =  await orderSchema.findOne({ userId: userId._id }).lean()
    if (!order) {
        return {}
    }
    logger.info("Order by user: " + order.userId)
    res.status(200).send(order)
}

exports.updateAvatar = async (req, res, next) =>{
    const img = req.file
    if(!img) {
        logger.warn('Add image')
    }
    const userId = req.user;
    try {
        await userSchema.findByIdAndUpdate({_id: userId._id},{ avatar: `/static/img/${img.originalname}`})
        res.status(201).redirect('/')
    } catch (error) {
        logger.error(err)
        res.status(500).send(err)
    }

}

exports.updateSendOrder = async (req, res) => {
    const {id} = req.params;
    const { username, email } = req.user;
    if (!id) {
        return res.sendStatus(404)
    }
    try {
        const order = await orderSchema.findById({_id: id})
        order.send = true;
        await order.save();
        //twilioSender.sendSms(username, email)
        res.sendStatus(202)
    } catch (err) {
    logger.error(err);
    res.status(500).send(err)
    }
}