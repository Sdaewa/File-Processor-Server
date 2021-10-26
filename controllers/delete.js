const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.delete = (req, res) => {
  cloudinary.api.resources(function (err, res) {
    const public_id = res.resources[0].public_id;

    cloudinary.uploader.destroy(public_id, function (res) {});
  });
  res.status(200).send();
};
