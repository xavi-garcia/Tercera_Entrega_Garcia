const userModel = require("../models/User");

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../logger');
const logger = log4js.getLogger();

exports.getAllUsers = async (req, res) => {
  const users = await userModel.find().lean();
  logger.info("User: " + users.length)
  res.status(200).send(users);
};

exports.getUserId = async (req, res) => {
    const { id } = req.params
    if (!id) {
    return res.sendStatus(404)
    }
    try {
        const user = await userModel.findById({ _id: id }).lean();
        logger.info("User:\n" + user.username);
        res.status(200).send({user});
    } 
    catch (err) {
        logger.error("Id not found" + err);
        res.status(500).send(err);
    }
};


exports.deleteAll = async (req, res) => {
    try {
        await userModel.deleteMany({});
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
        await userModel.deleteOne({ _id: id});
        logger.info("User removed from database");
        res.sendStatus(200)
    } 
    catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
}