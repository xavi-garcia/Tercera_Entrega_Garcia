const express = require('express');
const router = express.Router();

// Managers
const manager = require('../Managers/CartManager');

router.get("", manager.getAll);
router.get("/:id/products", manager.getCartById);
router.get("/:id/products", manager.getCartByUser);
router.post("/:id/products/:idprod", manager.UploadCart);
router.delete('/:id', manager.deleteCart);
router.delete('/:id/products/:product', manager.deleteProd);
router.delete("", manager.deleteAll);

module.exports = router;