const chatSchema = require('../schema/chatSchema');
//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();

module.exports = {

  getAllChats: async (req, res) => {
    const chat = await chatSchema.find();
    logger.info("SUCCESS")
    res.status(200).json({
      message: "These are all the chats stored in the db",
      chat: chat,
      author: chat.author,
      text: chat.text,
      date: chat.date
    });
  },

  getChatById: async (req, res) => {
    const { id } = req.params;
    try {
      const chat = await chatSchema.findById(id);
      logger.info("Success: the cart was successfully found")
      res.status(200).json({
        message: "Success: the cart was successfully found",
        chat: chat
      });
    } catch (error) {
      logger.error(error);
      res.status(500);
    }
  },

  writeMessage: async (req, res) => {
    const { body } = req;
    try {
      const text = await chatSchema.create({body});
      logger.info("Message successfully stored in db");
      res.status(201).json({
        message: "Message successfully stored in db",
        text: text
      })
    } catch (error) {
      logger.error(error);
      res.status(500);
    }
  },


  deleteChatById: async (req, res) => {
    const { id } = req.params;
    try {
      await chatSchema.deleteOne({_id: id});
      const chats = await chatSchema.find();
      logger.info("Message successfully deleted");
      res.status(200).json({
        message: "Message successfully deleted",
        chats: chats
      })
    } catch (error) {
      logger.error(error);
      res.status(500);
    }
  },


  deleteAllChats: async (req, res) => {
    try {
      await chatModel.deleteMany();
      const chats = await chatModel.find();
      res.status(200).json({
        message: "All messages successfully deleted from database",
        chats: chats
      })
    } catch (error) {
      logger.error("All messages failed to be deleted", error);
      res.status(500).send(error);
    }
  },
};