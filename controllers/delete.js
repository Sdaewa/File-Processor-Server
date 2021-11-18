const { cloudinary } = require("../utils/cloudinary");
const AWS = require("aws-sdk");

require("dotenv").config({ path: ".env" });

const S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.delete = (req, res) => {
  const params1 = {
    Bucket: process.env.AWS_BUCKET,
  };

  S3.listObjects(params1)
    .promise()
    .then((result) => {
      return result.Contents[0].Key;
    })
    .then((key) => {
      const params2 = {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
      };

      S3.deleteObject(params2).promise();
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
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};
