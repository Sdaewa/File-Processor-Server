const axios = require("axios");
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.downloadPdf = (req, res) => {
  cloudinary.api.resources(function (err, res) {
    if (err) {
      return console.log(err);
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
