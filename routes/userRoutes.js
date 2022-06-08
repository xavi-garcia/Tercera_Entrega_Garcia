const express = require('express');
const router = express.Router();

// Managers
const { getAllUsers, getUserId, deleteAll, deleteOne } = require('../Managers/UserManager');

router.get("", getAllUsers);
router.get("/:id", getUserId);
router.delete("", deleteAll);
router.delete("/:id", deleteOne);

module.exports = router;