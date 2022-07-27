const express = require('express');
const router = express.Router();

// Models
const productSchema = require("../schema/productsSchema");
const cartSchema = require("../schema/cartSchema");
const orderSchema = require("../schema/orderSchema");

// Manager
const orderController = require("../Managers/OrdersManager");

// middleware
const auth = require('../middlewares/auth');
const { generateToken } = require('../config/jwtAuth');
const jwtAuth = require('../config/jwtAuth')

// passport
const passport = require('passport');

// gzip compression
const compression = require('compression');

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();

// mail sender
const nodeMailSender = require('../config/notificationServices/mailSender');
const twilioSender = require('../config/notificationServices/twilio');

//Main
router.get('/', auth, async (req, res) => {
    const user = req.user;
    try {
        const prods = await productSchema.find().lean()
        const cart = await cartSchema.findOne({ user: user._id.toString()})
        res.render('main', { username: user.username, cartId: cart._id, products: prods })
    } catch (err) {
        logger.error(err)
        res.status(500).send(err)
    }
});

//Chat
router.get('/chat', (req, res) => res.render('chat'))

//Errors
router.get('/partials/formErr', (req, res) => res.render('partials/formErr'));
router.get('/partials/signUpError', (req, res) => res.render('partials/signUpError'))

//Login
router.get('/login', (req, res) => res.render('login'))

// router.post("/login", passport.authenticate('login',{
//     successRedirect: "/profile",
//     failureRedirect: '/partials/formErr',
//     failureMessage: true
//   }));

router.post("/login", passport.authenticate('login',{
    failureRedirect: '/partials/formErr',
    failureMessage: true
    
  }),(req, res)=>{
    const token = generateToken(req.user);
      res.clearCookie("token");
      res.cookie("token", token, {
        httpOnly: true
      });
    res.redirect("/profile")
    logger.info("Successfull Login")
});

//Register
router.get('/signup', async (req, res) => res.render('signup'))

router.post("/signup", passport.authenticate('signup',{
    failureRedirect: '/partials/signUpError',
    failureMessage: true
}),(req, res)=>{
    const token = generateToken(req.user);
    res.clearCookie("token");
    res.cookie("token", token);
    res.redirect("/profile")
});

//Profile
router.get("/profile", auth, async (req, res)=>{
    const { name, username, avatar, age, phone, email } = req.user
    res.render("profile", { name, username, avatar, age, phone, email })
});

  
//Logout ('Now logout() requires a callback function)
router.get('/logout', auth, function(req, res, next) {
    const { username } = req.user
    req.logout(function(err) {
      if (err) { return next(err); }
      res.clearCookie("token");
      res.render("logout", { username });
    });
  });

// GET Cart
router.get('/cart', auth, async (req, res) => {
    const userId = req.user;
    try {
        const cart = await cartSchema.findOne({ user: userId._id.toString()}).lean();
        const products = await Promise.all(cart.products.map(pId => productSchema.findById(pId).lean()));
        const total = products.reduce((total, prod) => total + prod.price, 0);
        res.render('cart', { cartId: cart._id, products, total});
    } catch (error) {
        logger.error(error)
        res.status(500).send(error)
    }
})


// GET Order
router.get("/order", auth, async (req, res) => {
    const { email, username} = req.user;
    const userId = req.user;
    const context = { sent: false };
    
    const cart = await cartSchema.findOne({ user: userId._id.toString()});
    const products = await Promise.all(cart.products.map(pId => productSchema.findById(pId).lean()));
    
    const data = Math.floor(Math.random()*1000);
    
    const total = products.reduce((total, prod) => total + prod.price, 0);

    try {
        cart.products = [];
        await cart.save();

        await orderSchema.create({
        userId: userId._id.toString(),
        email: email.toString(),
        sendAddress: cart.address,
        products: products,
        orderId: data,
        total,
        });

        const prodElements = products.map(p => `<li>${p.name}</li>`);
        const template = `<h1 style="color: yellow;"> Your order is being processed </h1>
                          <p>These are your products: </p>
                          <ul>${prodElements.join(" ")}</ul>`
        await nodeMailSender.send(template, email, username);
        await twilioSender.sendMessage(username, email);
        context.sent = true;
        logger.info("Successful Order")
        } catch (error) {
        logger.error(error)
        res.status(500).send(error)
    }
    res.render("order")
})


//Error
router.get("*", (req, res)=>{
    logger.error("This route doesn't exist")
    res.status(404).send("Not Found")
})

module.exports = router