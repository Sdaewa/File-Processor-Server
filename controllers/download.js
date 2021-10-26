const axios = require("axios");
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

cloudinary.api.resources(function (error, result) {
  console.log(result);
});

exports.downloadPdf = (req, res) => {
  cloudinary.api.resources(function (error, result) {
    console.log(result);
    if (!result.resources[0].url) {
      return console.log("no file found");
    }
    const url = result.resources[0].url;
    axios
      .get(url, { responseType: "arraybuffer" })
      .then((result) => {
        console.log("url", result.config.url);
        const buffer = Buffer.from(result.config.url, "utf-8");
        const fileString = buffer.toString("base64");
        const pdfData = `data:image/jpeg;base64,${fileString}`;
        console.log("pdf", pdfData);
      })
      .catch((err) => {
        console.log(err);
      });

    res.download(pdfData);
  });
};
