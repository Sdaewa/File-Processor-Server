const express = require("express");

const uploadController = require("../controllers/upload");

const router = express.Router();

router.post("/upload/:public_id", uploadController.upload);

module.exports = router;
