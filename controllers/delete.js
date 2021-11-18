const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.delete = (req, res) => {
  res.status(200).send();
};
