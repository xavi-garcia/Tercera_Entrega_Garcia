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
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();

// mail sender
const mailSender = require('../config/notificationServices/mailSender');


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
    failureRedirect: '/signup',
    failureMessage: true
}),(req, res)=>{
    res.redirect("/profile")
    logger.info(req.body)
});

//Profile
router.get("/profile", auth, async (req, res)=>{
    const { name, username, avatar, age, phone, email } = req.user
    res.render("profile", { name, username, avatar, age, phone, email })
});

router.post('/addAvatar', upload.single('avatar', orderController.updateAvatar))
  
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
        const cart = await cartSchema.findOne({ user: userId._id.toString()}).lean();
        const products = await Promise.all(cart.products.map(pId => productSchema.findById(pId).lean()));
        const total = products.reduce((total, prod) => total + prod.price, 0);
        // for(let i = o; total < products.length; --i){
        //     total =+ i
        //     return total
        // }
        res.render('cart', { cartId: cart._id, products, total});
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
  
    const cart = await cartSchema.findOne({ user: userId._id.toString()});
    const products = await Promise.all(cart.products.map(pId => productModel.findById(pId).lean()));
    const total = products.reduce((total, prod) => total + prod.price, 0);
  
    try {
        await orderSchema.create({
        userId: userId._id.toString(),
        total
        })

        cart.products = []
        await cart.save()
      
        const prodElements = products.map(p => `<li>${p.name}</li>`)
        const template = `<h1 style="color: yellow;"> Your order is being processed </h1>
                          <p>These are your products: </p>
                          <ul>${prodElements.join(" ")}</ul>`
        mailSender.send(template, email, username)
        // twilioSender.sendSms(username, email)
        // twilioSender.sendWhatsapp(phone, username, email)
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
    logger.error("This route doesn't exist")
    res.status(404).send("Not Found")
})

module.exports = router