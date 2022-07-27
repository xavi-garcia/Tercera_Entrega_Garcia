const express = require('express');
const router = express.Router();

// Managers
const manager = require('../Managers/OrdersManager');

router.get("", manager.getAllOrders);
router.get("/:id", manager.getByUserId);
router.post("/:cartId/:userID", manager.createOrder);
router.put("/:id", manager.updateSendOrder);
router.delete('/:id', manager.deleteById);
router.delete("", manager.deleteAll);

module.exports = router