const request = require("request").defaults({
  encoding: null,
});
const convertapi = require("convertapi")(process.env.CONVERT_API);
const https = require("https");
const axios = require("axios");
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.convertToMin = (req, res) => {
  cloudinary.api
    .resources()
    .then((result) => {
      const url = result.resources[0].url;

      // request.get(url, function (err, res, body) {
      convertapi
        .convert(
          "compress",
          {
            File: url,
          },
          "pdf"
        )
        .then(function (result) {
          // result.saveFiles("/path/to/dir");
          console.log(result.response);
          // res.status(200).send({ data: result.response });
        });
      // });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
