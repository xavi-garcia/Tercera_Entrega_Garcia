const express = require('express');
const router = express.Router();

const manager = require('../Managers/ProductsManager');

router.get("", manager.getAll);
router.get("/:id", manager.getProdById);
router.get("/category/:category", manager.getProdByCategory);
router.post("", manager.uploadProd);
router.put("/:id", manager.updateProd);
router.delete("/:id", manager.deleteProd);
router.delete("", manager.deleteAll);


module.exports = router;