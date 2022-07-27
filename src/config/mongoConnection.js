const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config({path:'./config/env/.env'})
//Log4js
const log4js = require('log4js');
const loggersConfig = require('./logger');
const logger = log4js.getLogger();

const ConfigMongo = {
    name : process.env.MONGO_DBNAME,
    collection: process.env.MONGO_DBNAME,
    host: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@codercluster.mmv7k.mongodb.net/${process.env.MONGO_DBNAME}db?retryWrites=true&w=majority`
}



class MyMongoClient {
    constructor() {
        (this.connected = false), (this.client = mongoose);
    }

    async connect(){
        try {
            await this.client.connect(ConfigMongo.host);
            logger.info("DataBase connected");
        } catch (error) {
            logger.error("Cannot Connect") ;
        }
    }

    async disconnect() {
        try {
            await this.client.close();
        } catch (error) {
            logger.error("Cannot Diconnect")
        }
    }
}

module.exports = MyMongoClient 