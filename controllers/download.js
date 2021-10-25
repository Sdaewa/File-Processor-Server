const os = require("os");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: ".env" });

const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.downloadPdf = (req, res) => {
  cloudinary.api.resources(function (error, result) {
    console.log(result.resources[0].url);

    if (!result.resources[0].url) {
      return console.log("no file found");
    }
    res.download(result.resources[0].url);
  });
};
