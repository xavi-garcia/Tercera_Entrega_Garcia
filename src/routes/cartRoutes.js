const express = require('express');
const router = express.Router();

// Managers
const manager = require('../Managers/CartManager');

router.get("", manager.getAll);
router.get("/:id", manager.getCartById);
router.get("/:id/user", manager.getCartByUser);
router.post('/:userId', manager.createCart)
router.post("/:id/products/:idprod", manager.addProductById);
router.put("/:id/products/:prodId", manager.updateCartById);
router.delete('/:id', manager.deleteCart);
router.delete('/:id/products/:product', manager.deleteProd);
router.delete("", manager.deleteAll);

module.exports = router;