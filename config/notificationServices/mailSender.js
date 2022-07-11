const nodemailer = require("nodemailer");
const {createTransport} = require('nodemailer');
require('dotenv').config({path:'./config/.env'});

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../logger');
const logger = log4js.getLogger();

class MailSender {
  constructor() {
    
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PWD
      }
    });
  }

  async send(template, email, name) {
    const mailOptions = {
      from: "<no-reply@allthingsjapan.com>",
      to: email, 
      subject: `New order from ${name}, ${email}`, 
      text: "Order Successfully created", 
      html: template
    };
    try {
      const response = await this.transporter.sendMail(mailOptions);
      logger.info("The email was sent and the id is:" + response.messageId);
    } catch (error) {
      logger.error(error)
    }
    
  }

  async aNewUserMail(template) {
    const mailOptions = {
      to: 'trad.ljgarcia@gmail.com', 
      subject: `New user registered`,
      text: `A new user was successfully registered`,
      html: template 
    };
    try {
      const response = await this.transporter.sendMail(mailOptions);
      logger.info(response.envelope);
    } catch (error) {
      logger.error(error)
    }

  }
}

module.exports = new MailSender();