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
          return res.status(200).send({ url: result.response.Files[0].Url });
        });
    })
    .then(() => {
      cloudinary.api.resources(function (err, res) {
        const public_id = res.resources[0].public_id;
        if (!public_id) {
          res.status(404).json({
            message: "No files to delete",
          });
        }
        cloudinary.uploader.destroy(public_id);
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
