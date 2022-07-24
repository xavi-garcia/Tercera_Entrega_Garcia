const twilio = require('twilio')
require('dotenv').config({path:'./config/.env'});

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../logger');
const logger = log4js.getLogger();

const phone = process.env.MY_PHONE;

class TwilioSender {
    constructor() {
      this.client = twilio(process.env.TWILIO_ID, process.env.TWILIO_TOKEN);
    }
  
    async sendMessage(username, email) {
        try {
            const message = await this.client.messages.create({
            body: `New order from ${username}, ${email}`,
            from: process.env.TWILIO_PHONE,
            to: process.env.MY_PHONE
        })
        logger.info(message.sid)
        } catch (error) {
            logger.error(error)
        }
    }
  
}
  
  module.exports = new TwilioSender();