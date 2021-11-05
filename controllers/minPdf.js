const request = require("request");
const https = require("https");
const axios = require("axios");
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.convertToMin = (req, res) => {
  cloudinary.api
    .resources()
    .then((result) => {
      const file = cloudinary.image(result.resources[0].public_id, {
        quality: 50,
      });

      console.log(file);
      res.status(200).send(file);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
