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

cloudinary.api.resources(function (error, result) {
  console.log(result.resources[0].url);
});

exports.downloadPdf = (req, res) => {
  const prex = "temp-";

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), prex));
  const file = fs.readFileSync(temp);
  console.log(file);

  const fileName = fs.readdirSync(path.resolve(__dirname, "../files/pdf"));
  const pathToPdf = path.join(__dirname, `../files/pdf/${fileName[0]}`);
  // const file = fs.readFileSync(pathToPdf);
  if (!file) {
    return console.log("no file found");
  }
  res.download(pathToPdf, fileName[0]);
  setTimeout(() => {
    fs.unlinkSync(pathToPdf);
  }, 2000);
};
