const express = require('express');
const router = express.Router();

// Managers
const { getAllUsers, getUserId, deleteAll, deleteOne, updateUserById, createUsers} = require('../Managers/UserManager');

router.post("",createUsers);
router.get("", getAllUsers);
router.get("/:id", getUserId);
router.put("/:id", updateUserById);
router.delete("", deleteAll);
router.delete("/:id", deleteOne);

module.exports = router;