const router = require("express").Router();

const manager = require('../Managers/ChatManager');

router.get("", manager.getAllChats);
router.get("/:id", manager.getChatById);
router.post("", manager.writeMessage);
router.delete("/:id", manager.deleteChatById);
router.delete("", manager.deleteAllChats);

module.exports = router;