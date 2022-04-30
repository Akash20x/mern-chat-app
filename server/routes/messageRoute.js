const express = require("express");
const router = express.Router();

const { addMessage, getMessage } = require("../controllers/messagesController");

router.post("/add-message", addMessage);
router.get("/get-messages", getMessage);

module.exports = router;
