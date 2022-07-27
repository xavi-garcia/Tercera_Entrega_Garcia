const express = require('express');
const router = express.Router();

//Managers
const productManager = require("../Managers/ProductsManager");
const orderManager = require("../Managers/OrdersManager");
const adminManager = require("../Managers/AdminManager");

//Schema
const productSchema = require("../schema/productsSchema");

// middleware
const auth = require('../middlewares/auth');

router.get("/", auth, adminManager.index);
router.get("/users", auth, adminManager.getUsers);
router.get("/products", auth, adminManager.getProducts);
router.get("/addProduct", auth, (req, res) => res.render("admin/addProduct"));
router.post("/addProduct", productManager.uploadProd)
router.get("/updateProduct/:id", auth, adminManager.getById);
router.post('/updateProduct/:id', auth, productManager.updateProd)
router.get("/orders", auth, adminManager.getOrders);
router.delete("/orders", auth, orderManager.deleteAll);

module.exports = router