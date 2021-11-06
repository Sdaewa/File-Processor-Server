const request = require("request");
const https = require("https");
const axios = require("axios");
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.convertToMin = (req, res) => {
  cloudinary.api
    .resources()
    .then((result) => {
      const url = result.resources[0].url;

      var request = require("request").defaults({
        encoding: null,
      });
      request.get(url, function (err, res, body) {
        let reqOptions = {
          uri: process.env.PDF_CO_URL,
          headers: { "x-api-key": process.env.API_KEY },
          formData: {
            name: "minPDf/pdf",
            file: body,
          },
        };
        // Send request
        request.post(reqOptions, function (error, res, body) {
          // Parse JSON response
          if (!error) {
            console.log(error);

            // // Download PDF file

            axios.get(body, (response2) => {
              console.log(response2);
              // response2.pipe(file).on("close", () => {
              // console.log(`Generated PDF file saved as "${pathToMin}" file.`);
              // });
            });
          } else {
            // Service reported error
            console.log("Error: " + data.message);
            // throw new Error({ error: data.message });
          }
        });
      });

      res.status(200).send({ url: result.resources[0].url });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
