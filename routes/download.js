const express = require("express");

const downloadController = require("../controllers/download");

const router = express.Router();

router.get("/downloadPdf", downloadController.downloadPdf);

module.exports = router;
