const express = require('express');
const router = express.Router();

const manager = require('../Managers/ProductsManager');

router.get("", manager.get);
router.get("/:id", manager.getById);
router.post("", manager.upload);
router.put("/:id", manager.update);
router.delete("/:id", manager.deleteProd);
router.delete("", manager.deleteAll);


module.exports = router;