const express = require('express');
const app = express();
const session = require('express-session');
const router = express.Router()

const MyMongoClient = require ('./config/mongoConnection');
const chatSchema = require ('./schema/chatSchema');

const { Server } = require("socket.io");
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config({path:'./config/env/.env'})

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./config/logger');
const logger = log4js.getLogger();

//Passport
const passport = require('passport');
const initializePassport = require('./config/passportConnection')
initializePassport(passport);


//Template handlebars
const templateEngine = require('./engine');
templateEngine(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:true, 
  saveUninitialized:true,
  
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())


//Routers
const adminRouter = require("./routes/adminRoutes");
const cartRouter = require("./routes/cartRoutes");
const prodRouter = require("./routes/productsRoutes");
const userRouter = require("./routes/userRoutes");
const mainRouter = require("./routes/mainRoutes");
const infoRouter = require("./routes/infoRoutes");
const chatRouter = require('./routes/chatRoutes');
const orderRouter = require('./routes/ordersRoutes')

app.use("/admin", adminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/products", prodRouter);
app.use("/api/users", userRouter);
app.use("/", mainRouter);
app.use("/info", infoRouter);
app.use('/api/chat', chatRouter);
app.use('/api/orders', orderRouter);

//Connection
const port = process.env.PORT || 8080;
const server = app.listen(port,()=>logger.info(` Running process ${process.pid} on port ${port}`));
const io = new Server(server);
let client = new MyMongoClient();
client.connect();

// Socket connection
io.on("connection", async (socket) => {
    socket.on("message", async (data) => {
      const message = await chatSchema.create(data);
      return message;
    });
  
    const messages = await chatSchema.find();
    io.sockets.emit("messages", messages);
})


