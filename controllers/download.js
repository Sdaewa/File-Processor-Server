const axios = require("axios");
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

cloudinary.api.resources(function (error, res) {
  console.log(res);
});

exports.downloadPdf = (req, res) => {
  cloudinary.api.resources(function (error, res) {
    if (!res.resources[0].url) {
      return console.log("no file found");
    }
    const url = res.resources[0].url;
    axios
      .get(url, { responseType: "arraybuffer" })
      .then((res) => {
        res.send(res.data);
      })
      .catch((err) => {
        res.send(err);
      });
  });
};
