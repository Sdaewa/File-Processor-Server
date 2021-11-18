const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.downloadPdf = (req, res) => {
  cloudinary.api
    .resources()
    .then((result) => {
      res.status(200).send({ url: result.resources[0].url });
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
