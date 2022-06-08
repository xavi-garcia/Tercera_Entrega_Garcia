const express = require('express');
const router = express.Router();

// Models
const productModel = require("../models/Products")
const cartModel = require("../models/Cart")
const orderModel = require("../models/Order")

// Manager
const orderController = require("../Managers/OrdersManager")

// middleware
const auth = require('../middlewares/auth')

// multer
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/img")
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })

// passport
const passport = require('passport');

// gzip compression
const compression = require('compression');

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../logger');
const logger = log4js.getLogger();




//Main
router.get('/', auth, async (req, res) => {
    const user = req.user
    
    try {
        const prods = await productModel.find().lean()
        const cart = await cartModel.findOne({ user: user._id.toString()})
        res.render('main', { firstName: user.firstName, cartId: cart._id, products: prods })
    } catch (err) {
        logger.error(err)
        res.status(500).send(err)
    }
});


//Login
router.get('/login', (req, res) => res.render('login'))

router.post("/login", passport.authenticate('login',{
    failureRedirect: '/login',
    failureMessage: true
  }),(req, res)=>{
    res.redirect("/profile")
    logger.info(req.body)
});

//Register
router.get('/signup', async (req, res) => res.render('signup'))

router.post("/signup", passport.authenticate('signup',{
    failureRedirect: '/signup'
}),(req, res)=>{
    res.redirect("/profile")
    logger.info(req.body)
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
      res.render("logout", { username });
    });
  });

// GET Cart
router.get('/cart', auth, async (req, res) => {
    const userId = req.user;
    try {
        const cart = await cartModel.findOne({ user: userId._id.toString()}).lean();
        const products = await Promise.all(cart.products.map(pId => productModel.findById(pId).lean()));
        const total = products.reduce((total, prod) => total + prod.price, 0);
    
        res.render('cart',  { cartId: cart._id, products, total });
    } catch (error) {
        logger.error(error)
        res.status(500).send(error)
    }
})


// GET Order
router.get("/order", auth, async (req, res) => {
    const { email, username, phone } = req.user;
    const userId = req.user;
    const context = { sent: false };
  
    const cart = await cartModel.findOne({ user: userId._id.toString()});
    const products = await Promise.all(cart.products.map(pId => productModel.findById(pId).lean()));
    const total = products.reduce((total, prod) => total + prod.price, 0);
  
    try {
        await orderModel.create({
        userId: userId._id.toString(),
        total})

        cart.products = []
        await cart.save()
      
        const prodElements = products.map(p => `<li>${p.name}</li>`)
        const template = `<h1 style="color: yellow;"> Your order is being processed </h1>
        <p>AThese are your products: </p>
        <ul>
          ${prodElements.join(" ")}
        </ul>
      `
        mailSender.send(template, email, username)
        twilioSender.sendSms(username, email)
        twilioSender.sendWhatsapp(phone, username, email)
        context.sent = true
        logger.info("Successful Order")
        } catch (err) {
        logger.error(err)
        res.status(500).send(err)
    }
  
    res.render("order", context)
})


//Error
router.get("*", (req, res)=>{
    logger.warn("can't access")
    res.status(404).send("Not Found")
})

module.exports = router