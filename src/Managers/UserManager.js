const userSchema = require("../schema/userSchema");

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();


exports.createUsers = async (req,res) =>{
    const {body} = req;
    try {
        await userSchema.create(body);
        res.status(201).resend(body);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error)
    }
}

exports.getAllUsers = async (req, res) => {
  const users = await userSchema.find().lean();
  logger.info("User: " + users.length)
  res.status(200).send(users);
};

exports.getUserId = async (req, res) => {
    const { id } = req.params
    if (!id) {
    return res.sendStatus(404)
    }
    try {
        const user = await userSchema.findById({ _id: id }).lean();
        logger.info("User:\n" + user.username);
        res.status(200).send({user});
    } catch (err) {
        logger.error("Id not found" + err);
        res.status(500).send(err);
    }
};

exports.updateUserById = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    if (!id) { return res.sendStatus(404)};
    try {
        const user = await userSchema.findById({ _id: id }).lean();
        const update = await userSchema.updateOne({_id: id,}, {$set: body,});
        logger.info("User info succesfully updated");
        res.status(201).send(body);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
}

exports.deleteAll = async (req, res) => {
    try {
        await userSchema.deleteMany({});
        logger.info("All useres were removed from the database");
        res.status(200).send("All cleared");
    } 
    catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
}

exports.deleteOne = async (req, res) => {
    const { id } = req.params
    try {
        await userSchema.deleteOne({ _id: id});
        logger.info("User removed from database");
        res.sendStatus(200)
    } 
    catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
}