const express = require('express');
const router = express.Router();

//Managers
const productManager = require("../Managers/ProductsManager");
const orderManager = require("../Managers/OrdersManager");
const adminManager = require("../Managers/AdminManager");


// middleware
const auth = require('../middlewares/auth');

// passport
const passport = require('passport');

// GET admin index
router.get("/", auth, adminManager.index);

// GET products admin
router.get("/products", auth, adminManager.getProducts)

// GET add products admin
router.get("/addProduct", auth, (req, res) => res.render("admin/addProduct"))

// POST add product admin
router.post("/addProduct", productManager.upload);

// GET orders admin
router.get("/orders", auth, adminManager.getOrders)

// DELETE orders admin
router.delete("/orders", auth, orderManager.deleteAllOrders)


module.exports = router