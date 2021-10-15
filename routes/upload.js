const express = require("express");

const uploadController = require("../controllers/upload");

const router = express.Router();

router.post("/upload", uploadController.upload);

module.exports = router;
