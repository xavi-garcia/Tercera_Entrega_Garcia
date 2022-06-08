const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const http = require('http')
const path = require('path')

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./logger');
const logger = log4js.getLogger();

//Passport
app.use(passport.initialize());
app.use(passport.session());




















const app = express()
const port = process.env.PORT || 8080;

app.listen(port,()=>logger.info(` Running process ${process.pid} on port ${port}`))

const URL = "mongodb+srv://javier:123@codercluster.mmv7k.mongodb.net/entregaterceradb?retryWrites=true&w=majority";

const MONGOOSE = mongoose.connect(URL, {
    useNewUrlParser: true, useUnifiedTopology: true
 }, error=>{
     if(error) throw new Error('Cannot connect');
     logger.info("db connected")
});
