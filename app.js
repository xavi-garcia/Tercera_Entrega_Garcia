const express = require('express');
const app = express()
const session = require('express-session');
const mongoose = require('mongoose');

const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./logger');
const logger = log4js.getLogger();

app.use(session({
    secret:'myappnodejs',
    resave:true, 
    saveUninitialized:true
}));

//Passport
const passport = require('passport');
const initializePassport = require('./passportConnection')
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// app.use(compression());

//template handlebars
const templateEngine = require('./engine');
templateEngine(app);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

// routers
const adminRouter = require("./routes/adminRoutes");
const cartRouter = require("./routes/cartRoutes");
const prodRouter = require("./routes/productsRoutes");
const userRouter = require("./routes/userRoutes");
const mainRouter = require("./routes/mainRoutes");
const infoRouter = require("./routes/infoRoutes");



app.use("/admin", adminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/products", prodRouter);
app.use("/api/users", userRouter);
app.use("/", mainRouter);
app.use("/info", infoRouter);



const port = process.env.PORT || 8080;

app.listen(port,()=>logger.info(` Running process ${process.pid} on port ${port}`))

const URL = "mongodb+srv://javier:123@codercluster.mmv7k.mongodb.net/entregaterceradb?retryWrites=true&w=majority";

const MONGOOSE = mongoose.connect(URL, {
    useNewUrlParser: true, useUnifiedTopology: true
 }, error=>{
     if(error) throw new Error('Cannot connect');
     logger.info("db connected")
});
