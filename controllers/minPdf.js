const fs = require("fs");
const path = require("path");
const request = require("request");
const https = require("https");

require("dotenv").config({ path: ".env" });

exports.convertToMin = (req, res) => {
  console.log(req);
  const fileName = fs.readdirSync(path.resolve(__dirname, "../files/pdf"));
  const pathToPdf = path.join(__dirname, `../files/pdf/${fileName[0]}`);
  const pathToMin = path.join(__dirname, `../files/minPdf/${fileName[0]}`);

  let reqOptions = {
    uri: process.env.PDF_CO_URL,
    headers: { "x-api-key": process.env.API_KEY },
    formData: {
      name: path.basename(pathToPdf),
      file: fs.createReadStream(pathToPdf),
    },
  };

  // Send request
  request.post(reqOptions, function (error, res, body) {
    // Parse JSON response
    let data = JSON.parse(body);
    if (data.error == false) {
      // Download PDF file
      const file = fs.createWriteStream(pathToMin);
      https.get(data.url, (response2) => {
        response2.pipe(file).on("close", () => {
          console.log(`Generated PDF file saved as "${pathToMin}" file.`);
        });
        fs.unlinkSync(pathToPdf);
        // fs.unlinkSync(pathToMin);
      });
    } else {
      // Service reported error

      console.log("Error: " + data.message);
      // throw new Error({ error: data.message });
    }
  });
};
