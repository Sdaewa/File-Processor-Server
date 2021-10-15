const express = require("express");

const deleteController = require("../controllers/delete");

const router = express.Router();

router.post("/delete", deleteController.delete);

module.exports = router;
