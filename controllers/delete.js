const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.delete = (req, res) => {
  cloudinary.api.resources(function (err, res) {
    const public_id = res.resources[0].public_id;
    if (!public_id) {
      res.status(404).json({
        message: "No images to delete",
      });
    }
    cloudinary.uploader.destroy(public_id, function (res) {});
  });
  res.status(200).send();
};
