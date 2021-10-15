const express = require("express");

const sendEmailController = require("../controllers/sendEmail");

const router = express.Router();

router.post("/sendByEmail", sendEmailController.sendByEmail);

module.exports = router;
