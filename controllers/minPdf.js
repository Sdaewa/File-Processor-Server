const fs = require("fs");
const path = require("path");
const request = require("request");
const https = require("https");
const cloudinary = require("cloudinary").v2;
const { tmpdir } = require("os");

require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// const filepath = `${tmpdir()}/temp-`;
// const file = fs.readFileSync(filepath);
// console.log(file);

// fs.unlinkSync(`${tmpdir}`);
exports.convertToMin = (req, res) => {
  // const fileName = fs.readdirSync(path.resolve(__dirname, "../files/pdf"));
  // const pathToPdf = path.join(__dirname, `../files/pdf/${fileName[0]}`);
  // const pathToMin = path.join(__dirname, `../files/minPdf/${fileName[0]}`);
  cloudinary.api.resources(function (err, res) {
    if (err) {
      return console.log(err);
    }
    // axios
    //   .get(url, { responseType: "arraybuffer" })
    //   .then((res) => {})
    //   .catch((err) => {
    //     res.send(err);
    //   });
  });
  // let reqOptions = {
  //   uri: process.env.PDF_CO_URL,
  //   headers: { "x-api-key": process.env.API_KEY },
  //   formData: {
  //     name: "minPDf/pdf",
  //     file: fs.createReadStream(res.resources[0].url),
  //   },
  // };
  // const file = fs.readFileSync(req.file);
  // // Send request
  // request.post(reqOptions, function (error, res, body) {
  //   // Parse JSON response
  //   let data = JSON.parse(body);
  //   if (data.error == false) {
  //     // Download PDF file
  //     const file = fs.createWriteStream(pathToMin);
  //     https.get(data.url, (response2) => {
  //       response2.pipe(file).on("close", () => {
  //         console.log(`Generated PDF file saved as "${pathToMin}" file.`);
  //       });
  //       fs.unlinkSync(pathToPdf);
  //       // fs.unlinkSync(pathToMin);
  //     });
  //   } else {
  //     // Service reported error
  //     console.log("Error: " + data.message);
  //     // throw new Error({ error: data.message });
  //   }
  // });
};
