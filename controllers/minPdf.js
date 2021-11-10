const convertapi = require("convertapi")(process.env.CONVERT_API);
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.convertToMin = (req, res) => {
  cloudinary.api
    .resources()
    .then((result) => {
      const url = result.resources[0].url;
      convertapi
        .convert(
          "compress",
          {
            File: url,
          },
          "pdf"
        )
        .then(function (result) {
          return res.status(200).send({ data: result.response.Files[0].Url });
        });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
