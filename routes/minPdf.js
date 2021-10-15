const express = require("express");

const minPdfController = require("../controllers/minPdf");

const router = express.Router();

router.get("/convertToMin", minPdfController.convertToMin);

module.exports = router;
