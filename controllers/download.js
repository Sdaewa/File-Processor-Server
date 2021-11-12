const { cloudinary } = require("./utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.downloadPdf = (req, res) => {
  cloudinary.api
    .resources()
    .then((result) => {
      res.status(200).send({ url: result.resources[0].url });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
